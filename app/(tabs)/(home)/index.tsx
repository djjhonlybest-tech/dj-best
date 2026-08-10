import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Bot, Sliders, Trophy, Smartphone, Play } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const SUGGESTIONS = [
  {
    id: '1',
    title: 'Love Tonight',
    meta: '106 BPM • 8A • 98% match',
    iconBg: DJCOLORS.accentBlue,
    icon: '♪',
  },
  {
    id: '2',
    title: 'Party People',
    meta: '110 BPM • 9A • 94% match',
    iconBg: '#FF6B35',
    icon: '🔥',
  },
  {
    id: '3',
    title: 'Feel The Bass',
    meta: '105 BPM • 7A • 91% match',
    iconBg: DJCOLORS.gold,
    icon: '★',
  },
];

function SuggestionCard({ item, index }: { item: typeof SUGGESTIONS[0]; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  const handlePlay = () => {
    console.log(`[Home] Play suggestion: ${item.title}`);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 16,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: DJCOLORS.border,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: item.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          <Text style={{ fontSize: 22 }}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: DJCOLORS.text,
              fontSize: 16,
              fontWeight: '700',
              fontFamily: 'SpaceGrotesk-Bold',
              marginBottom: 3,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: DJCOLORS.textSecondary,
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Regular',
            }}
          >
            {item.meta}
          </Text>
        </View>
        <AnimatedPressable onPress={handlePlay}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: DJCOLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Play size={16} color={DJCOLORS.text} fill={DJCOLORS.text} />
          </View>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.55,
      duration: 1200,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const handleSuggestNext = () => {
    console.log('[Home] Button pressed: Suggest Next → navigating to AI Assistant');
    router.push('/ai-assistant' as any);
  };

  const handleStudio = () => {
    console.log('[Home] Button pressed: Studio → navigating to Studio tab');
    router.push('/(tabs)/(studio)');
  };

  const handleBattles = () => {
    console.log('[Home] Button pressed: DJ Battles → navigating to Battle tab');
    router.push('/(tabs)/(battle)');
  };

  const handleShorts = () => {
    console.log('[Home] Button pressed: Shorts → navigating to Shorts');
    router.push('/shorts' as any);
  };

  const handleBell = () => {
    console.log('[Home] Bell icon pressed');
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: DJCOLORS.text,
                fontFamily: 'SpaceGrotesk-Bold',
                letterSpacing: -0.5,
              }}
            >
              DJ
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: DJCOLORS.primary,
                fontFamily: 'SpaceGrotesk-Bold',
                letterSpacing: -0.5,
              }}
            >
              VERSE
            </Text>
          </View>
          <AnimatedPressable onPress={handleBell}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </View>
          </AnimatedPressable>
        </View>

        {/* NOW PLAYING Card */}
        <View
          style={{
            backgroundColor: DJCOLORS.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: 'rgba(123,79,255,0.3)',
            boxShadow: '0 4px 24px rgba(123,79,255,0.15)',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: DJCOLORS.textSecondary,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              fontFamily: 'SpaceGrotesk-Medium',
              marginBottom: 6,
            }}
          >
            NOW PLAYING
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: -0.3,
              marginBottom: 4,
            }}
          >
            Body On Fire
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: DJCOLORS.textSecondary,
              fontFamily: 'SpaceGrotesk-Regular',
              marginBottom: 16,
            }}
          >
            Afrobeat • 108 BPM • 8A
          </Text>

          {/* Progress Bar */}
          <View
            style={{
              height: 6,
              backgroundColor: DJCOLORS.surfaceSecondary,
              borderRadius: 3,
              marginBottom: 20,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                height: '100%',
                borderRadius: 3,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: DJCOLORS.accentBlue,
              }}
            />
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <AnimatedPressable onPress={handleSuggestNext} style={{ flex: 1 }}>
              <LinearGradient
                colors={[DJCOLORS.primary, '#C84FFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 16 }}>🤖</Text>
                <Text
                  style={{
                    color: DJCOLORS.text,
                    fontWeight: '700',
                    fontSize: 15,
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  Suggest Next
                </Text>
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable onPress={handleStudio} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: DJCOLORS.surfaceSecondary,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                }}
              >
                <Text style={{ fontSize: 16 }}>🎛️</Text>
                <Text
                  style={{
                    color: DJCOLORS.text,
                    fontWeight: '700',
                    fontSize: 15,
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  Studio
                </Text>
              </View>
            </AnimatedPressable>
          </View>
        </View>

        {/* AI Suggest Next Section */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: DJCOLORS.text,
            fontFamily: 'SpaceGrotesk-Bold',
            letterSpacing: -0.3,
            marginBottom: 16,
          }}
        >
          AI SUGGEST NEXT
        </Text>

        {SUGGESTIONS.map((item, index) => (
          <SuggestionCard key={item.id} item={item} index={index} />
        ))}

        {/* Bottom Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <AnimatedPressable onPress={handleBattles} style={{ flex: 1 }}>
            <LinearGradient
              colors={[DJCOLORS.primary, DJCOLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 18 }}>🏆</Text>
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                DJ Battles
              </Text>
            </LinearGradient>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleShorts} style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: DJCOLORS.surface,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <Text style={{ fontSize: 18 }}>📱</Text>
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                Shorts
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </View>
  );
}
