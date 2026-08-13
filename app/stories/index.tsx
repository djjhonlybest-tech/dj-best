import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const STORY_USERS = [
  {
    id: '1',
    label: 'DJ STORM',
    color: '#FF4F4F',
    gradientColors: ['#3A0A0A', '#1A0505', '#0A0A0F'] as const,
    initials: 'DS',
    segments: [
      { type: '📸 PHOTO', caption: 'Warming up the crowd tonight! 🔥' },
      { type: '🎵 MUSIC', caption: 'New track dropping this Friday 🎵' },
      { type: '🎥 VIDEO', caption: 'Behind the scenes at the studio 🎛️' },
      { type: '📸 PHOTO', caption: 'The crowd was INSANE last night 🙌' },
      { type: '🎵 MUSIC', caption: 'Rabòday vibes all day 🇭🇹' },
    ],
  },
  {
    id: '2',
    label: 'MARIE',
    color: '#FF4FC8',
    gradientColors: ['#3A0A2A', '#1A0515', '#0A0A0F'] as const,
    initials: 'MA',
    segments: [
      { type: '📸 PHOTO', caption: 'Morning vibes ☀️' },
      { type: '🎥 VIDEO', caption: 'Dance practice session 💃' },
      { type: '📸 PHOTO', caption: 'New fit check 👗' },
      { type: '🎵 MUSIC', caption: 'This song has me in my feelings 🎶' },
      { type: '🎥 VIDEO', caption: 'Collab coming soon... 👀' },
    ],
  },
  {
    id: '3',
    label: 'DJ NOVA',
    color: '#4FC8FF',
    gradientColors: ['#0A1A3A', '#051525', '#0A0A0F'] as const,
    initials: 'DN',
    segments: [
      { type: '🎵 MUSIC', caption: 'Afro-Kompa fusion is the future 🌍' },
      { type: '📸 PHOTO', caption: 'Studio session with the crew 🎛️' },
      { type: '🎥 VIDEO', caption: 'Live set highlights from last week 🎧' },
      { type: '📸 PHOTO', caption: 'New equipment just arrived! 🔊' },
      { type: '🎵 MUSIC', caption: 'Mixing until sunrise ⭐' },
    ],
  },
  {
    id: '4',
    label: 'KOMPA K',
    color: '#FFB800',
    gradientColors: ['#2A1A00', '#1A1000', '#0A0A0F'] as const,
    initials: 'KK',
    segments: [
      { type: '📸 PHOTO', caption: 'Caribbean vibes only 🌴' },
      { type: '🎵 MUSIC', caption: 'Kompa is life 🎷' },
      { type: '🎥 VIDEO', caption: 'Event recap — what a night! 🎉' },
      { type: '📸 PHOTO', caption: 'Shoutout to all my fans 🙏' },
      { type: '🎵 MUSIC', caption: 'New mix dropping Sunday 🎧' },
    ],
  },
  {
    id: '5',
    label: 'PARTY Q',
    color: '#34D399',
    gradientColors: ['#0A2A1A', '#051A10', '#0A0A0F'] as const,
    initials: 'PQ',
    segments: [
      { type: '🎥 VIDEO', caption: 'Party mode activated 🎊' },
      { type: '📸 PHOTO', caption: 'Best crowd ever tonight 🔥' },
      { type: '🎵 MUSIC', caption: 'This beat goes HARD 💥' },
      { type: '📸 PHOTO', caption: 'Backstage with the team 🎭' },
      { type: '🎥 VIDEO', caption: 'See you at the next event! 🎪' },
    ],
  },
];

const STORY_DURATION = 5000;
const REACTIONS = ['❤️', '🔥', '😱', '😂', '🙌'];

export default function StoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [userIndex, setUserIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const story = STORY_USERS[userIndex];
  const segment = story.segments[segmentIndex];
  const totalSegments = story.segments.length;

  // Progress animations — one per segment
  const progressAnims = useRef(
    STORY_USERS[0].segments.map(() => new Animated.Value(0))
  ).current;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const goNext = useCallback(() => {
    if (segmentIndex < totalSegments - 1) {
      console.log(`[Stories] Next segment: ${segmentIndex + 1} of ${story.label}`);
      setSegmentIndex((i) => i + 1);
    } else if (userIndex < STORY_USERS.length - 1) {
      console.log(`[Stories] Next user story: ${STORY_USERS[userIndex + 1].label}`);
      setUserIndex((u) => u + 1);
      setSegmentIndex(0);
    } else {
      console.log('[Stories] All stories viewed, closing');
      router.back();
    }
  }, [segmentIndex, totalSegments, userIndex, story.label, router]);

  const goPrev = useCallback(() => {
    if (segmentIndex > 0) {
      console.log(`[Stories] Prev segment: ${segmentIndex - 1} of ${story.label}`);
      setSegmentIndex((i) => i - 1);
    } else if (userIndex > 0) {
      console.log(`[Stories] Prev user story: ${STORY_USERS[userIndex - 1].label}`);
      setUserIndex((u) => u - 1);
      setSegmentIndex(0);
    }
  }, [segmentIndex, userIndex, story.label]);

  useEffect(() => {
    console.log(`[Stories] Viewing segment ${segmentIndex + 1}/${totalSegments} of ${story.label}`);

    // Reset all progress bars
    progressAnims.forEach((anim, i) => {
      if (i < segmentIndex) {
        anim.setValue(1);
      } else if (i === segmentIndex) {
        anim.setValue(0);
      } else {
        anim.setValue(0);
      }
    });

    if (isPaused) return;

    // Animate current segment
    progressAnimRef.current = Animated.timing(progressAnims[segmentIndex], {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    progressAnimRef.current.start(({ finished }) => {
      if (finished) goNext();
    });

    timerRef.current = setTimeout(() => {}, STORY_DURATION);

    return () => {
      progressAnimRef.current?.stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [segmentIndex, userIndex, isPaused]);

  const handleClose = () => {
    console.log('[Stories] Close button pressed');
    router.back();
  };

  const handlePausePlay = () => {
    const next = !isPaused;
    console.log(`[Stories] ${next ? 'Paused' : 'Resumed'} story`);
    setIsPaused(next);
    if (next) {
      progressAnimRef.current?.stop();
    }
  };

  const handleReaction = (emoji: string) => {
    console.log(`[Stories] Reaction sent: ${emoji} to ${story.label}`);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    console.log(`[Stories] Reply sent to ${story.label}: "${replyText}"`);
    setReplyText('');
  };

  const timeAgo = '2h ago';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Full-screen gradient background */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: story.gradientColors[0],
          }}
        />
      </Animated.View>

      {/* Tap zones */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', zIndex: 5 }}>
        <Pressable style={{ flex: 1 }} onPress={goPrev} />
        <Pressable style={{ flex: 1 }} onPress={goNext} />
      </View>

      {/* Progress bars */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 12,
          right: 12,
          flexDirection: 'row',
          gap: 4,
          zIndex: 20,
        }}
      >
        {story.segments.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                height: '100%',
                borderRadius: 2,
                backgroundColor: '#fff',
                width: progressAnims[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              }}
            />
          </View>
        ))}
      </View>

      {/* Top bar */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 20,
          left: 16,
          right: 16,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 20,
          gap: 10,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: story.color,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.5)',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
            {story.initials}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
            {story.label}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'SpaceGrotesk-Regular' }}>
            {timeAgo}
          </Text>
        </View>

        {/* Pause/Play */}
        <AnimatedPressable onPress={handlePausePlay} style={{ zIndex: 30 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14 }}>{isPaused ? '▶' : '⏸'}</Text>
          </View>
        </AnimatedPressable>

        {/* Close */}
        <AnimatedPressable onPress={handleClose} style={{ zIndex: 30 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, lineHeight: 20 }}>✕</Text>
          </View>
        </AnimatedPressable>
      </View>

      {/* Story type badge */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 70,
          left: 16,
          zIndex: 20,
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
            {segment.type}
          </Text>
        </View>
      </View>

      {/* Center content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: story.color,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            borderWidth: 3,
            borderColor: 'rgba(255,255,255,0.4)',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'SpaceGrotesk-Bold' }}>
            {story.initials}
          </Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 8, letterSpacing: 0.3 }}>
          {story.label}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 15,
            fontFamily: 'SpaceGrotesk-Regular',
            textAlign: 'center',
            paddingHorizontal: 32,
            lineHeight: 22,
          }}
        >
          {segment.caption}
        </Text>
      </View>

      {/* Bottom area */}
      <View style={{ zIndex: 20 }}>
        {/* Reactions */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            paddingHorizontal: 16,
            marginBottom: 12,
          }}
        >
          {REACTIONS.map((emoji) => (
            <AnimatedPressable key={emoji} onPress={() => handleReaction(emoji)}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.15)',
                }}
              >
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
              </View>
            </AnimatedPressable>
          ))}
        </View>

        {/* Reply bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 16,
            paddingTop: 12,
            gap: 10,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder={`Reply to ${story.label}...`}
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
          <AnimatedPressable onPress={handleSendReply}>
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
  );
}
