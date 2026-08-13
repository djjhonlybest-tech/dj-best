import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const LIVE_DATA = [
  { id: '1', name: 'DJ JHONLYBEST', genre: 'Kompa • Afrobeat', viewers: '1.2K', gradientColors: ['#1A0A3A', '#3A0A5A', '#0A0A1A'] as const },
  { id: '2', name: 'DJ KOMPA KING', genre: 'Kompa • Caribbean', viewers: '856', gradientColors: ['#0A1A3A', '#0A3A5A', '#0A0A1A'] as const },
  { id: '3', name: 'DJ NOVA', genre: 'Afro-Kompa', viewers: '2.4K', gradientColors: ['#2A0A1A', '#4A0A2A', '#0A0A1A'] as const },
];

const MOCK_COMMENTS = [
  { id: '1', user: 'DJ STORM', text: 'This set is 🔥🔥🔥', color: '#FF4F4F' },
  { id: '2', user: 'MARIE', text: 'Loving the vibes tonight!', color: '#FF4FC8' },
  { id: '3', user: 'FANATIC_BEATS', text: 'That transition was insane 😱', color: '#4FC8FF' },
  { id: '4', user: 'PARTY_QUEEN', text: 'Best DJ on DJ BEST 🏆', color: '#4FFF8A' },
  { id: '5', user: 'MUSIC_LOVER', text: 'Playing this at my party 🎉', color: '#FFB84F' },
];

const TIP_AMOUNTS = ['$1', '$5', '$10', '$25'];

interface FloatingHeart {
  id: number;
  x: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
  scale: Animated.Value;
}

export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const streamId = params.id ?? '1';
  const stream = LIVE_DATA.find((s) => s.id === streamId) ?? LIVE_DATA[0];

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [showComments, setShowComments] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [likeCount, setLikeCount] = useState(847);
  const [isFollowing, setIsFollowing] = useState(false);
  const [customTip, setCustomTip] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const heartIdRef = useRef(0);

  // Equalizer bar animations
  const eqBars = useRef([
    new Animated.Value(0.4),
    new Animated.Value(0.7),
    new Animated.Value(0.5),
  ]).current;

  // Comments panel slide
  const commentsSlide = useRef(new Animated.Value(400)).current;

  // Tip modal slide
  const tipSlide = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    console.log(`[Live] Joined live stream: ${stream.name} (${stream.viewers} watching)`);

    const loops = eqBars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, { toValue: 1, duration: 300 + i * 120, useNativeDriver: true }),
          Animated.timing(bar, { toValue: 0.2, duration: 300 + i * 100, useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);

  const spawnHearts = useCallback(() => {
    const count = 3 + Math.floor(Math.random() * 3);
    const newHearts: FloatingHeart[] = Array.from({ length: count }, (_, i) => {
      const id = ++heartIdRef.current;
      const opacity = new Animated.Value(1);
      const translateY = new Animated.Value(0);
      const scale = new Animated.Value(0.5);
      const x = 20 + Math.random() * 40;

      Animated.parallel([
        Animated.timing(translateY, { toValue: -180 - Math.random() * 80, duration: 1400, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(700),
          Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
        ]),
      ]).start(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
      });

      return { id, x, opacity, translateY, scale };
    });

    setFloatingHearts((prev) => [...prev, ...newHearts]);
  }, []);

  const handleClose = () => {
    console.log('[Live] Close button pressed');
    router.back();
  };

  const handleShare = () => {
    console.log(`[Live] Share button pressed for ${stream.name}`);
  };

  const handleLike = () => {
    console.log(`[Live] Like button pressed on ${stream.name}`);
    setLikeCount((c) => c + 1);
    spawnHearts();
  };

  const handleFollow = () => {
    const next = !isFollowing;
    console.log(`[Live] Follow button pressed on ${stream.name} → ${next ? 'Following' : 'Unfollowed'}`);
    setIsFollowing(next);
  };

  const handleToggleComments = () => {
    console.log(`[Live] Comments toggle pressed on ${stream.name}`);
    const opening = !showComments;
    setShowComments(opening);
    Animated.spring(commentsSlide, {
      toValue: opening ? 0 : 400,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  };

  const handleOpenTip = () => {
    console.log(`[Live] Tip button pressed on ${stream.name}`);
    setShowTipModal(true);
    Animated.spring(tipSlide, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 4 }).start();
  };

  const handleCloseTip = () => {
    console.log('[Live] Tip modal closed');
    Animated.timing(tipSlide, { toValue: 400, duration: 250, useNativeDriver: true }).start(() => {
      setShowTipModal(false);
    });
  };

  const handleSendTip = (amount: string) => {
    console.log(`[Live] Tip sent: ${amount} to ${stream.name}`);
    handleCloseTip();
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    console.log(`[Live] Comment sent on ${stream.name}: "${commentText}"`);
    const newComment = {
      id: String(Date.now()),
      user: 'YOU',
      text: commentText,
      color: DJCOLORS.primary,
    };
    setComments((prev) => [...prev, newComment]);
    setCommentText('');
  };

  const likeCountDisplay = likeCount.toLocaleString();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Full-screen gradient background */}
      <LinearGradient
        colors={stream.gradientColors}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Floating hearts */}
      {floatingHearts.map((heart) => (
        <Animated.View
          key={heart.id}
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: heart.x,
            bottom: insets.bottom + 200,
            opacity: heart.opacity,
            transform: [{ translateY: heart.translateY }, { scale: heart.scale }],
            zIndex: 50,
          }}
        >
          <Text style={{ fontSize: 28 }}>❤️</Text>
        </Animated.View>
      ))}

      {/* Top bar */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          right: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.danger,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
            <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>LIVE</Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.55)',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
              👁 {stream.viewers}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AnimatedPressable onPress={handleShare}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Text style={{ fontSize: 15 }}>↗️</Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable onPress={handleClose}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, lineHeight: 20 }}>✕</Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>

      {/* Right sidebar */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          zIndex: 20,
        }}
      >
        {/* Like */}
        <View style={{ alignItems: 'center', gap: 4 }}>
          <AnimatedPressable onPress={handleLike}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <Text style={{ fontSize: 22 }}>❤️</Text>
            </View>
          </AnimatedPressable>
          <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>
            {likeCountDisplay}
          </Text>
        </View>

        {/* Comments */}
        <AnimatedPressable onPress={handleToggleComments}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: showComments ? DJCOLORS.primary : 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: showComments ? DJCOLORS.primary : 'rgba(255,255,255,0.15)',
            }}
          >
            <Text style={{ fontSize: 22 }}>💬</Text>
          </View>
        </AnimatedPressable>

        {/* Share */}
        <AnimatedPressable onPress={handleShare}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Text style={{ fontSize: 22 }}>↗️</Text>
          </View>
        </AnimatedPressable>

        {/* Follow */}
        <AnimatedPressable onPress={handleFollow}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isFollowing ? DJCOLORS.primary : 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: isFollowing ? DJCOLORS.primary : 'rgba(255,255,255,0.15)',
            }}
          >
            <Text style={{ fontSize: 22 }}>{isFollowing ? '✅' : '➕'}</Text>
          </View>
        </AnimatedPressable>

        {/* Tip */}
        <AnimatedPressable onPress={handleOpenTip}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: `${DJCOLORS.gold}55`,
            }}
          >
            <Text style={{ fontSize: 22 }}>💰</Text>
          </View>
        </AnimatedPressable>
      </View>

      {/* Bottom overlay — DJ info */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          left: 16,
          right: 72,
          zIndex: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.primaryMuted,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderWidth: 1,
              borderColor: DJCOLORS.primary,
            }}
          >
            <Text style={{ color: DJCOLORS.primary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold' }}>
              LIVE DJ SET
            </Text>
          </View>
        </View>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.3, marginBottom: 2 }}>
          {stream.name}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 10 }}>
          {stream.genre}
        </Text>
        {/* Equalizer bars */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 20 }}>
          {eqBars.map((bar, i) => (
            <Animated.View
              key={i}
              style={{
                width: 4,
                height: 18,
                borderRadius: 2,
                backgroundColor: i === 0 ? DJCOLORS.primary : i === 1 ? DJCOLORS.accent : DJCOLORS.accentBlue,
                transform: [{ scaleY: bar }],
              }}
            />
          ))}
        </View>
      </View>

      {/* Comments panel */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 380,
          transform: [{ translateY: commentsSlide }],
          zIndex: 30,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(10,10,15,0.92)',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTopWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: DJCOLORS.textTertiary }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}>
              <Text style={{ color: DJCOLORS.text, fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' }}>
                💬 Comments
              </Text>
              <AnimatedPressable onPress={handleToggleComments}>
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 14 }}>✕</Text>
              </AnimatedPressable>
            </View>
            <ScrollView
              style={{ flex: 1, paddingHorizontal: 16 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
            >
              {comments.map((comment) => (
                <View key={comment.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: comment.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'SpaceGrotesk-Bold' }}>
                      {comment.user.slice(0, 2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: DJCOLORS.surface,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      flex: 1,
                      borderWidth: 1,
                      borderColor: DJCOLORS.border,
                    }}
                  >
                    <Text style={{ color: comment.color, fontSize: 11, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 2 }}>
                      {comment.user}
                    </Text>
                    <Text style={{ color: DJCOLORS.text, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
                      {comment.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 10,
                borderTopWidth: 1,
                borderTopColor: DJCOLORS.border,
              }}
            >
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor={DJCOLORS.textTertiary}
                style={{
                  flex: 1,
                  height: 44,
                  backgroundColor: DJCOLORS.surfaceSecondary,
                  borderRadius: 22,
                  paddingHorizontal: 16,
                  color: DJCOLORS.text,
                  fontSize: 14,
                  fontFamily: 'SpaceGrotesk-Regular',
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                }}
              />
              <AnimatedPressable onPress={handleSendComment}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: DJCOLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>➤</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Tip Modal */}
      <Modal visible={showTipModal} transparent animationType="none" onRequestClose={handleCloseTip}>
        <TouchableWithoutFeedback onPress={handleCloseTip}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 24,
                  paddingBottom: insets.bottom + 24,
                  borderTopWidth: 1,
                  borderColor: DJCOLORS.border,
                  transform: [{ translateY: tipSlide }],
                }}
              >
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: DJCOLORS.textTertiary, marginBottom: 16 }} />
                  <Text style={{ color: DJCOLORS.text, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 4 }}>
                    💰 Send a Tip
                  </Text>
                  <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
                    Support {stream.name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                  {TIP_AMOUNTS.map((amount) => (
                    <AnimatedPressable key={amount} onPress={() => handleSendTip(amount)} style={{ flex: 1 }}>
                      <View
                        style={{
                          backgroundColor: DJCOLORS.surfaceSecondary,
                          borderRadius: 14,
                          paddingVertical: 16,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: `${DJCOLORS.gold}44`,
                        }}
                      >
                        <Text style={{ color: DJCOLORS.gold, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' }}>
                          {amount}
                        </Text>
                      </View>
                    </AnimatedPressable>
                  ))}
                </View>

                <TextInput
                  value={customTip}
                  onChangeText={setCustomTip}
                  placeholder="Custom amount..."
                  placeholderTextColor={DJCOLORS.textTertiary}
                  keyboardType="numeric"
                  style={{
                    height: 48,
                    backgroundColor: DJCOLORS.surfaceSecondary,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    color: DJCOLORS.text,
                    fontSize: 15,
                    fontFamily: 'SpaceGrotesk-Regular',
                    borderWidth: 1,
                    borderColor: DJCOLORS.border,
                    marginBottom: 16,
                  }}
                />

                <AnimatedPressable onPress={() => handleSendTip(customTip || '$5')}>
                  <LinearGradient
                    colors={[DJCOLORS.gold, '#FF8C00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 16,
                      paddingVertical: 18,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#0A0A0F', fontWeight: '800', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' }}>
                      SEND TIP 💰
                    </Text>
                  </LinearGradient>
                </AnimatedPressable>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
