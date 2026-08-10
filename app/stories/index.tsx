import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const STORY_DATA = [
  { id: 'you', label: 'Your Story', color: '#7B4FFF', initials: '+' },
  { id: '1', label: 'DJ STORM', color: '#FF4F4F', initials: 'DS' },
  { id: '2', label: 'MARIE', color: '#FF4FC8', initials: 'MA' },
  { id: '3', label: 'DJ NOVA', color: '#4FC8FF', initials: 'DN' },
  { id: '4', label: 'KOMPA K', color: '#FFB800', initials: 'KK' },
  { id: '5', label: 'PARTY Q', color: '#34D399', initials: 'PQ' },
];

const STORY_DURATION = 5000;

export default function StoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const storyId = params.id ?? '1';
  const story = STORY_DATA.find((s) => s.id === storyId) ?? STORY_DATA[1];

  const progressAnim = useRef(new Animated.Value(0)).current;
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    console.log(`[Stories] Viewing story from: ${story.label}`);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      console.log('[Stories] Auto-navigating back after 5 seconds');
      router.back();
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [progressAnim, router, story.label]);

  const handleClose = () => {
    console.log('[Stories] Close button pressed');
    router.back();
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    console.log(`[Stories] Reply sent to ${story.label}: "${replyText}"`);
    setReplyText('');
  };

  const captionText = `Story from ${story.label}`;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Progress bar */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          right: 16,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.25)',
          borderRadius: 2,
          zIndex: 20,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: 2,
            backgroundColor: '#fff',
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>

      {/* Close button */}
      <AnimatedPressable
        onPress={handleClose}
        style={{
          position: 'absolute',
          top: insets.top + 20,
          left: 16,
          zIndex: 30,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, lineHeight: 22 }}>✕</Text>
        </View>
      </AnimatedPressable>

      {/* Center content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Avatar circle */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: story.color,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            borderWidth: 3,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 36, fontFamily: 'SpaceGrotesk-Bold' }}>
            {story.initials}
          </Text>
        </View>

        <Text
          style={{
            color: '#fff',
            fontSize: 22,
            fontFamily: 'SpaceGrotesk-Bold',
            marginBottom: 10,
            letterSpacing: 0.5,
          }}
        >
          {story.label}
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 15,
            fontFamily: 'SpaceGrotesk-Regular',
          }}
        >
          {captionText}
        </Text>
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
          placeholder="Reply to story..."
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
    </KeyboardAvoidingView>
  );
}
