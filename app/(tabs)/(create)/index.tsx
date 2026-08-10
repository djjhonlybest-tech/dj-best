import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

interface CreateOption {
  id: string;
  icon: string;
  label: string;
  sub: string;
  route: string | null;
}

const CREATE_OPTIONS: CreateOption[] = [
  { id: '1', icon: '📱', label: 'Post a Short', sub: 'Share your mix', route: '/shorts' },
  { id: '2', icon: '🎛️', label: 'New Mix', sub: 'Open DJ Studio', route: '/(tabs)/(studio)' },
  { id: '3', icon: '🏆', label: 'Start Battle', sub: 'Challenge a DJ', route: '/(tabs)/(battle)' },
  { id: '4', icon: '🎵', label: 'Share Track', sub: 'Upload your track', route: null },
];

const RECENT_POSTS = [
  { id: '1', title: 'Afrobeat Vibes Mix', time: '2h ago', color: '#2A1A4A' },
  { id: '2', title: 'Kompa Night Session', time: '1d ago', color: '#1A2A4A' },
  { id: '3', title: 'Amapiano Sunrise', time: '3d ago', color: '#1A3A2A' },
];

function CreateOptionCard({
  option,
  index,
  onPress,
}: {
  option: CreateOption;
  index: number;
  onPress: () => void;
}) {
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemTranslate = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemOpacity, {
        toValue: 1,
        duration: 350,
        delay: 100 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(itemTranslate, {
        toValue: 0,
        duration: 350,
        delay: 100 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [itemOpacity, itemTranslate, index]);

  return (
    <Animated.View
      style={{
        width: '47%',
        opacity: itemOpacity,
        transform: [{ translateY: itemTranslate }],
      }}
    >
      <AnimatedPressable onPress={onPress}>
        <View
          style={{
            backgroundColor: DJCOLORS.surface,
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: DJCOLORS.border,
            minHeight: 120,
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 36 }}>{option.icon}</Text>
          <Text
            style={{
              color: DJCOLORS.text,
              fontWeight: '700',
              fontSize: 15,
              fontFamily: 'SpaceGrotesk-Bold',
              textAlign: 'center',
            }}
          >
            {option.label}
          </Text>
          <Text
            style={{
              color: DJCOLORS.textSecondary,
              fontSize: 12,
              fontFamily: 'SpaceGrotesk-Regular',
              textAlign: 'center',
            }}
          >
            {option.sub}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const handleOption = (option: CreateOption) => {
    console.log(`[Create] Option pressed: ${option.label}`);
    if (option.route) {
      router.push(option.route as any);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: -0.5,
              marginBottom: 8,
            }}
          >
            CREATE
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: DJCOLORS.textSecondary,
              fontFamily: 'SpaceGrotesk-Regular',
              marginBottom: 28,
            }}
          >
            What do you want to create today?
          </Text>
        </Animated.View>

        {/* Options Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 32,
          }}
        >
          {CREATE_OPTIONS.map((option, index) => (
            <CreateOptionCard
              key={option.id}
              option={option}
              index={index}
              onPress={() => handleOption(option)}
            />
          ))}
        </View>

        {/* Recent Posts */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: DJCOLORS.text,
            fontFamily: 'SpaceGrotesk-Bold',
            marginBottom: 16,
          }}
        >
          Recent Posts
        </Text>

        {RECENT_POSTS.map((post) => (
          <View
            key={post.id}
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: post.color,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontWeight: '600',
                  fontSize: 15,
                  fontFamily: 'SpaceGrotesk-Medium',
                  marginBottom: 3,
                }}
              >
                {post.title}
              </Text>
              <Text
                style={{
                  color: DJCOLORS.textSecondary,
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Regular',
                }}
              >
                {post.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
