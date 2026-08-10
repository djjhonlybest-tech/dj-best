import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const LIVE_DATA = [
  { id: '1', name: 'DJ JHONLYBEST', viewers: '1.2K', color: '#1A0A3A', initials: 'DJ' },
  { id: '2', name: 'DJ KOMPA KING', viewers: '856', color: '#0A1A3A', initials: 'KK' },
  { id: '3', name: 'DJ NOVA', viewers: '2.4K', color: '#2A0A1A', initials: 'DN' },
];

const MOCK_COMMENTS = [
  { id: '1', user: 'DJ STORM', text: 'This set is 🔥🔥🔥', color: '#FF4F4F' },
  { id: '2', user: 'MARIE', text: 'Loving the vibes tonight!', color: '#FF4FC8' },
  { id: '3', user: 'FANATIC_BEATS', text: 'That transition was insane 😱', color: '#4FC8FF' },
  { id: '4', user: 'PARTY_QUEEN', text: 'Best DJ on DJVERSE 🏆', color: '#4FFF8A' },
  { id: '5', user: 'MUSIC_LOVER', text: 'Playing this at my party 🎉', color: '#FFB84F' },
];

export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const streamId = params.id ?? '1';
  const stream = LIVE_DATA.find((s) => s.id === streamId) ?? LIVE_DATA[0];

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  // Pulse animation for the love button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log(`[Live] Joined live stream: ${stream.name} (${stream.viewers} watching)`);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, stream.name, stream.viewers]);

  const handleClose = () => {
    console.log('[Live] Close button pressed');
    router.back();
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

  const handleSendLove = () => {
    console.log(`[Live] Send Love pressed on ${stream.name}`);
  };

  const viewersText = `${stream.viewers} watching`;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DJCOLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Stream placeholder */}
      <View
        style={{
          width: '100%',
          aspectRatio: 9 / 16,
          backgroundColor: stream.color,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* DJ name overlay */}
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.5 }}>
            {stream.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
            Live DJ Set
          </Text>
        </View>
      </View>

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
        {/* LIVE badge + viewers */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              backgroundColor: '#FF4F4F',
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
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
              {viewersText}
            </Text>
          </View>
        </View>

        {/* Close button */}
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

      {/* Bottom panel */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 8,
        }}
      >
        {/* Comments list */}
        <ScrollView
          style={{ maxHeight: 200, paddingHorizontal: 16, marginBottom: 12 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {comments.map((comment) => (
            <View key={comment.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: comment.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 8, fontFamily: 'SpaceGrotesk-Bold' }}>
                  {comment.user.slice(0, 2)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flex: 1,
                }}
              >
                <Text style={{ color: comment.color, fontSize: 11, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 1 }}>
                  {comment.user}
                </Text>
                <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
                  {comment.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Comment input row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            gap: 10,
          }}
        >
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={{
              flex: 1,
              height: 44,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 22,
              paddingHorizontal: 16,
              color: '#fff',
              fontSize: 14,
              fontFamily: 'SpaceGrotesk-Regular',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
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

      {/* Send Love floating button */}
      <Animated.View
        style={{
          position: 'absolute',
          right: 16,
          bottom: insets.bottom + 70,
          transform: [{ scale: pulseAnim }],
          zIndex: 30,
        }}
      >
        <AnimatedPressable onPress={handleSendLove}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#FF4F4F',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,79,79,0.4)',
            }}
          >
            <Text style={{ fontSize: 24 }}>❤️</Text>
          </View>
        </AnimatedPressable>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
