import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Video,
  Send,
  Mic,
  Paperclip,
  Play,
  Pause,
  Camera,
  Music,
  Headphones,
  X,
} from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextMessage {
  id: string;
  type: 'text';
  content: string;
  sender: 'me' | 'them';
  timestamp: string;
  seen?: boolean;
}

interface VoiceMessage {
  id: string;
  type: 'voice';
  duration: string;
  sender: 'me' | 'them';
  timestamp: string;
  seen?: boolean;
}

interface TimestampDivider {
  id: string;
  type: 'divider';
  label: string;
}

type Message = TextMessage | VoiceMessage | TimestampDivider;

interface ConversationMeta {
  username: string;
  userType: 'DJ' | 'Creator';
  avatarColor: string;
  initials: string;
  isOnline: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CONVERSATION_META: Record<string, ConversationMeta> = {
  '1': { username: 'DJ STORM', userType: 'DJ', avatarColor: '#FF4F4F', initials: 'DS', isOnline: true },
  '2': { username: 'MARIE_CREATOR', userType: 'Creator', avatarColor: '#FF4FC8', initials: 'MC', isOnline: true },
  '3': { username: 'DJ NOVA', userType: 'DJ', avatarColor: '#4FC8FF', initials: 'DN', isOnline: false },
  '4': { username: 'KOMPA KING', userType: 'DJ', avatarColor: '#FFB800', initials: 'KK', isOnline: true },
  '5': { username: 'PARTY_QUEEN', userType: 'Creator', avatarColor: '#34D399', initials: 'PQ', isOnline: false },
  '6': { username: 'DJ BEATS', userType: 'DJ', avatarColor: '#A04FFF', initials: 'DB', isOnline: true },
  '7': { username: 'FANATIC_BEATS', userType: 'Creator', avatarColor: '#4FC8FF', initials: 'FB', isOnline: false },
  '8': { username: 'DJ JHONLYBEST', userType: 'DJ', avatarColor: '#7B4FFF', initials: 'JB', isOnline: false },
};

const DEFAULT_META: ConversationMeta = {
  username: 'Unknown User',
  userType: 'DJ',
  avatarColor: '#7B4FFF',
  initials: '??',
  isOnline: false,
};

const INITIAL_MESSAGES: Message[] = [
  { id: 'd1', type: 'divider', label: 'Yesterday' },
  { id: 'm1', type: 'text', content: 'Yo! Saw your set last night, absolute fire 🔥', sender: 'them', timestamp: '8:14 PM' },
  { id: 'm2', type: 'text', content: 'Thanks bro! That crowd was insane 🙌', sender: 'me', timestamp: '8:16 PM' },
  { id: 'm3', type: 'voice', duration: '0:12', sender: 'them', timestamp: '8:18 PM' },
  { id: 'm4', type: 'text', content: 'Haha yeah that drop at 1:30 was crazy. What track was that?', sender: 'me', timestamp: '8:20 PM' },
  { id: 'm5', type: 'text', content: 'It\'s an unreleased collab with DJ NOVA. Dropping next week 👀', sender: 'them', timestamp: '8:22 PM' },
  { id: 'd2', type: 'divider', label: 'Today' },
  { id: 'm6', type: 'text', content: 'Bro are you free this weekend? We\'re doing a battle event', sender: 'them', timestamp: '10:05 AM' },
  { id: 'm7', type: 'voice', duration: '0:28', sender: 'me', timestamp: '10:08 AM' },
  { id: 'm8', type: 'text', content: 'Sounds good! Send me the details', sender: 'me', timestamp: '10:09 AM' },
  { id: 'm9', type: 'text', content: 'Port-au-Prince, Saturday 9PM. DJ BEST main stage 🎧', sender: 'them', timestamp: '10:11 AM' },
  { id: 'm10', type: 'text', content: 'I\'m in! 🔥🔥🔥', sender: 'me', timestamp: '10:12 AM', seen: true },
];

// ─── Waveform Bars ────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [6, 10, 14, 8, 18, 12, 20, 9, 16, 11, 19, 7, 15, 13, 20, 8, 17, 10, 14, 6];

function WaveformBars({ isPlaying, color }: { isPlaying: boolean; color: string }) {
  const animations = useRef(BAR_HEIGHTS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    if (isPlaying) {
      const loops = animations.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: 200 + i * 30,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 200 + i * 30,
              useNativeDriver: true,
            }),
          ])
        )
      );
      loops.forEach((l) => l.start());
      return () => loops.forEach((l) => l.stop());
    } else {
      animations.forEach((anim) =>
        Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }).start()
      );
    }
  }, [isPlaying]);

  return (
    <View style={styles.waveformContainer}>
      {BAR_HEIGHTS.map((h, i) => (
        <Animated.View
          key={i}
          style={[
            styles.waveformBar,
            {
              height: h,
              backgroundColor: color,
              transform: [{ scaleY: animations[i] }],
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Voice Message Bubble ─────────────────────────────────────────────────────

function VoiceMessageBubble({
  msg,
  isMine,
}: {
  msg: VoiceMessage;
  isMine: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const next = !isPlaying;
    console.log(`[Chat] Voice message ${msg.id} ${next ? 'play' : 'pause'}`);
    setIsPlaying(next);
  };

  const bubbleBg = isMine ? DJCOLORS.primary : DJCOLORS.surface;
  const iconColor = isMine ? '#FFFFFF' : DJCOLORS.primary;
  const waveColor = isMine ? 'rgba(255,255,255,0.7)' : DJCOLORS.primary;
  const textColor = isMine ? 'rgba(255,255,255,0.8)' : DJCOLORS.textSecondary;

  return (
    <View style={[styles.voiceBubble, { backgroundColor: bubbleBg }]}>
      <TouchableOpacity
        onPress={handlePlayPause}
        activeOpacity={0.7}
        style={[styles.playButton, { backgroundColor: isMine ? 'rgba(255,255,255,0.2)' : DJCOLORS.primaryMuted }]}
      >
        {isPlaying ? (
          <Pause size={14} color={iconColor} />
        ) : (
          <Play size={14} color={iconColor} />
        )}
      </TouchableOpacity>
      <WaveformBars isPlaying={isPlaying} color={waveColor} />
      <Text style={[styles.voiceDuration, { color: textColor }]}>{msg.duration}</Text>
    </View>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.type === 'divider') {
    return (
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>{msg.label}</Text>
        <View style={styles.dividerLine} />
      </View>
    );
  }

  const isMine = msg.sender === 'me';

  return (
    <View style={[styles.messageRow, isMine ? styles.messageRowRight : styles.messageRowLeft]}>
      {msg.type === 'voice' ? (
        <VoiceMessageBubble msg={msg} isMine={isMine} />
      ) : (
        <View
          style={[
            styles.textBubble,
            isMine ? styles.textBubbleMine : styles.textBubbleThem,
          ]}
        >
          <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextThem]}>
            {msg.content}
          </Text>
        </View>
      )}
      <View style={[styles.metaRow, isMine ? styles.metaRowRight : styles.metaRowLeft]}>
        <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
        {isMine && msg.seen && (
          <Text style={styles.seenLabel}>Seen</Text>
        )}
      </View>
    </View>
  );
}

// ─── Attachment Menu ──────────────────────────────────────────────────────────

const ATTACHMENT_OPTIONS = [
  { icon: Camera, label: 'Photo', color: '#4FC8FF' },
  { icon: Video, label: 'Video', color: '#FF4FC8' },
  { icon: Music, label: 'Sound', color: '#34D399' },
  { icon: Headphones, label: 'Mix', color: '#7B4FFF' },
];

function AttachmentMenu({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.attachOverlay} onPress={onClose}>
        <View style={styles.attachMenu}>
          <View style={styles.attachMenuHeader}>
            <Text style={styles.attachMenuTitle}>Share</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={18} color={DJCOLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.attachGrid}>
            {ATTACHMENT_OPTIONS.map((opt) => (
              <AnimatedPressable key={opt.label} onPress={() => onSelect(opt.label)}>
                <View style={styles.attachOption}>
                  <View style={[styles.attachIconCircle, { backgroundColor: opt.color + '22' }]}>
                    <opt.icon size={22} color={opt.color} />
                  </View>
                  <Text style={styles.attachLabel}>{opt.label}</Text>
                </View>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

// ─── Recording Indicator ──────────────────────────────────────────────────────

function RecordingIndicator({ seconds }: { seconds: number }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.4, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerText = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <View style={styles.recordingIndicator}>
      <Animated.View style={[styles.recordingDot, { transform: [{ scale: pulse }] }]} />
      <Text style={styles.recordingText}>Recording</Text>
      <Text style={styles.recordingTimer}>{timerText}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const meta = CONVERSATION_META[id ?? ''] ?? DEFAULT_META;

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, [isRecording]);

  const handleSendText = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    console.log(`[Chat] Sending text message to ${meta.username}: "${text}"`);
    const newMsg: TextMessage = {
      id: `m${Date.now()}`,
      type: 'text',
      content: text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText, meta.username]);

  const handleMicPress = useCallback(() => {
    if (isRecording) {
      const duration = recordingSeconds;
      console.log(`[Chat] Stopped recording voice message — duration: ${duration}s`);
      setIsRecording(false);
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;
      const newMsg: VoiceMessage = {
        id: `v${Date.now()}`,
        type: 'voice',
        duration: durationStr || '0:01',
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } else {
      console.log('[Chat] Started recording voice message');
      setIsRecording(true);
    }
  }, [isRecording, recordingSeconds]);

  const handleAttachPress = () => {
    console.log('[Chat] Tapped attachment button');
    setShowAttachMenu(true);
  };

  const handleAttachSelect = (label: string) => {
    console.log(`[Chat] Selected attachment type: ${label}`);
    setShowAttachMenu(false);
  };

  const handleCallPress = () => {
    console.log(`[Chat] Tapped call button for ${meta.username}`);
  };

  const handleVideoPress = () => {
    console.log(`[Chat] Tapped video call button for ${meta.username}`);
  };

  const handleBack = () => {
    console.log('[Chat] Tapped back');
    router.back();
  };

  const onlineStatusText = meta.isOnline ? 'Online' : 'Offline';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack}>
          <View style={styles.backButton}>
            <ArrowLeft size={22} color={DJCOLORS.text} />
          </View>
        </AnimatedPressable>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatarWrapper}>
            <View style={[styles.headerAvatar, { backgroundColor: meta.avatarColor + '33' }]}>
              <Text style={[styles.headerAvatarText, { color: meta.avatarColor }]}>
                {meta.initials}
              </Text>
            </View>
            {meta.isOnline && <View style={styles.headerOnlineDot} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerUsername} numberOfLines={1}>
              {meta.username}
            </Text>
            <Text style={[styles.headerStatus, { color: meta.isOnline ? DJCOLORS.success : DJCOLORS.textTertiary }]}>
              {onlineStatusText}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <AnimatedPressable onPress={handleCallPress}>
            <View style={styles.headerActionBtn}>
              <Phone size={18} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
          <AnimatedPressable onPress={handleVideoPress}>
            <View style={styles.headerActionBtn}>
              <Video size={18} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          contentContainerStyle={[styles.messagesList, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            {
              paddingBottom: insets.bottom + 8,
              borderTopColor: DJCOLORS.border,
            },
          ]}
        >
          {isRecording ? (
            <RecordingIndicator seconds={recordingSeconds} />
          ) : (
            <View style={styles.inputRow}>
              {/* Attachment */}
              <AnimatedPressable onPress={handleAttachPress}>
                <View style={styles.inputIconBtn}>
                  <Paperclip size={20} color={DJCOLORS.textSecondary} />
                </View>
              </AnimatedPressable>

              {/* Text Input */}
              <TextInput
                style={styles.textInput}
                placeholder="Message..."
                placeholderTextColor={DJCOLORS.textTertiary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                returnKeyType="default"
              />

              {/* Send or Mic */}
              {inputText.trim().length > 0 ? (
                <AnimatedPressable onPress={handleSendText}>
                  <View style={styles.sendButton}>
                    <Send size={18} color="#FFFFFF" />
                  </View>
                </AnimatedPressable>
              ) : (
                <AnimatedPressable onPress={handleMicPress}>
                  <View style={styles.inputIconBtn}>
                    <Mic size={20} color={DJCOLORS.primary} />
                  </View>
                </AnimatedPressable>
              )}
            </View>
          )}

          {/* Cancel recording */}
          {isRecording && (
            <View style={styles.recordingActions}>
              <AnimatedPressable onPress={() => { console.log('[Chat] Cancelled voice recording'); setIsRecording(false); }}>
                <View style={styles.cancelRecordBtn}>
                  <X size={16} color={DJCOLORS.danger} />
                  <Text style={styles.cancelRecordText}>Cancel</Text>
                </View>
              </AnimatedPressable>
              <AnimatedPressable onPress={handleMicPress}>
                <View style={styles.sendRecordBtn}>
                  <Send size={16} color="#FFFFFF" />
                  <Text style={styles.sendRecordText}>Send</Text>
                </View>
              </AnimatedPressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Attachment Menu */}
      <AttachmentMenu
        visible={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        onSelect={handleAttachSelect}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DJCOLORS.background,
  },
  flex: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DJCOLORS.border,
    gap: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: DJCOLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatarWrapper: {
    position: 'relative',
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk-Bold',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DJCOLORS.success,
    borderWidth: 2,
    borderColor: DJCOLORS.background,
  },
  headerInfo: {
    flex: 1,
    gap: 1,
  },
  headerUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  headerStatus: {
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: DJCOLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  // Messages
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4,
  },
  messageRow: {
    marginVertical: 3,
  },
  messageRowRight: {
    alignItems: 'flex-end',
  },
  messageRowLeft: {
    alignItems: 'flex-start',
  },
  textBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  textBubbleMine: {
    backgroundColor: DJCOLORS.primary,
    borderBottomRightRadius: 4,
  },
  textBubbleThem: {
    backgroundColor: DJCOLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  bubbleTextMine: {
    color: '#FFFFFF',
  },
  bubbleTextThem: {
    color: DJCOLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
    paddingHorizontal: 4,
  },
  metaRowRight: {
    justifyContent: 'flex-end',
  },
  metaRowLeft: {
    justifyContent: 'flex-start',
  },
  messageTimestamp: {
    fontSize: 11,
    color: DJCOLORS.textTertiary,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  seenLabel: {
    fontSize: 11,
    color: DJCOLORS.primary,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DJCOLORS.divider,
  },
  dividerLabel: {
    fontSize: 11,
    color: DJCOLORS.textTertiary,
    fontFamily: 'SpaceGrotesk-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  // Voice bubble
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 10,
    maxWidth: '78%',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  voiceDuration: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    flexShrink: 0,
  },
  // Input bar
  inputBar: {
    backgroundColor: DJCOLORS.surface,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: DJCOLORS.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: DJCOLORS.surfaceSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Regular',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DJCOLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Recording
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DJCOLORS.danger,
  },
  recordingText: {
    fontSize: 14,
    color: DJCOLORS.danger,
    fontFamily: 'SpaceGrotesk-Medium',
    flex: 1,
  },
  recordingTimer: {
    fontSize: 14,
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingBottom: 4,
  },
  cancelRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: DJCOLORS.danger + '22',
    borderWidth: 1,
    borderColor: DJCOLORS.danger + '40',
  },
  cancelRecordText: {
    fontSize: 13,
    color: DJCOLORS.danger,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  sendRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: DJCOLORS.primary,
    flex: 1,
    justifyContent: 'center',
  },
  sendRecordText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  // Attachment menu
  attachOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  attachMenu: {
    backgroundColor: DJCOLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: DJCOLORS.border,
  },
  attachMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  attachMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  attachGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attachOption: {
    alignItems: 'center',
    gap: 8,
  },
  attachIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  attachLabel: {
    fontSize: 12,
    color: DJCOLORS.textSecondary,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});
