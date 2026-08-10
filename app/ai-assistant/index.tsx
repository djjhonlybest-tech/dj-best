import React, { useRef, useEffect, useState } from 'react';
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
import { ArrowLeft, Search, ChevronDown, Play, Plus } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const RESULTS = [
  { id: '1', rank: 1, title: 'Love Tonight', artist: 'Various', bpm: '106', key: '8A', genre: 'Afrobeat', match: 98 },
  { id: '2', rank: 2, title: 'Party People', artist: 'Various', bpm: '110', key: '9A', genre: 'Afrobeat', match: 94 },
  { id: '3', rank: 3, title: 'Feel The Bass', artist: 'Various', bpm: '105', key: '7A', genre: 'Kompa', match: 91 },
  { id: '4', rank: 4, title: 'Midnight Energy', artist: 'Various', bpm: '112', key: '10A', genre: 'Amapiano', match: 88 },
  { id: '5', rank: 5, title: 'Afro Vibes', artist: 'Various', bpm: '108', key: '8A', genre: 'Afrobeat', match: 85 },
];

const ENERGY_MODES = [
  { id: '1', icon: '🔥', label: 'MORE ENERGY' },
  { id: '2', icon: '💜', label: 'SMOOTH' },
  { id: '3', icon: '🌴', label: 'SWITCH GENRE' },
  { id: '4', icon: '🎧', label: 'BUILD SET' },
];

function ResultCard({ item, index }: { item: typeof RESULTS[0]; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  const handlePreview = () => {
    console.log(`[AI Assistant] Preview pressed: ${item.title}`);
  };

  const handleAddToSet = () => {
    console.log(`[AI Assistant] Add to Set pressed: ${item.title}`);
  };

  const matchColor =
    item.match >= 95
      ? DJCOLORS.success
      : item.match >= 90
      ? DJCOLORS.accentBlue
      : DJCOLORS.primary;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: DJCOLORS.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: DJCOLORS.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: DJCOLORS.primary,
              fontWeight: '800',
              fontSize: 14,
              fontFamily: 'SpaceGrotesk-Bold',
            }}
          >
            {item.rank}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: DJCOLORS.text,
              fontWeight: '700',
              fontSize: 15,
              fontFamily: 'SpaceGrotesk-Bold',
              marginBottom: 2,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: DJCOLORS.textSecondary,
              fontSize: 12,
              fontFamily: 'SpaceGrotesk-Regular',
            }}
          >
            {item.bpm}
            {' BPM • '}
            {item.key}
            {' • '}
            {item.genre}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: `${matchColor}20`,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginRight: 8,
          }}
        >
          <Text
            style={{
              color: matchColor,
              fontSize: 12,
              fontWeight: '700',
              fontFamily: 'SpaceGrotesk-Bold',
            }}
          >
            {item.match}
            {'%'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AnimatedPressable onPress={handlePreview}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: DJCOLORS.primaryMuted,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Play size={14} color={DJCOLORS.primary} fill={DJCOLORS.primary} />
            </View>
          </AnimatedPressable>
          <AnimatedPressable onPress={handleAddToSet}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <Plus size={14} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default function AIAssistantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  const handleBack = () => {
    console.log('[AI Assistant] Back button pressed');
    router.back();
  };

  const handleSearch = () => {
    console.log('[AI Assistant] Search button pressed');
  };

  const handleGetSuggestions = () => {
    console.log('[AI Assistant] GET SUGGESTIONS button pressed');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      console.log('[AI Assistant] Suggestions loaded');
    }, 1200);
  };

  const handleEnergyMode = (mode: typeof ENERGY_MODES[0]) => {
    console.log(`[AI Assistant] Energy mode pressed: ${mode.label}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}
        >
          <AnimatedPressable onPress={handleBack}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <ArrowLeft size={20} color={DJCOLORS.text} />
            </View>
          </AnimatedPressable>

          <Text
            style={{
              fontSize: 16,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: 0.5,
            }}
          >
            AI DJ ASSISTANT
          </Text>

          <AnimatedPressable onPress={handleSearch}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <Search size={20} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
        </View>

        {/* Hero */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Animated.View
            style={{
              opacity: glowAnim,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: DJCOLORS.primaryMuted,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              borderWidth: 2,
              borderColor: DJCOLORS.primary,
            }}
          >
            <Text style={{ fontSize: 48 }}>🤖</Text>
          </Animated.View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: -0.3,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            WHAT SHOULD I{'\n'}PLAY NEXT?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: DJCOLORS.textSecondary,
              fontFamily: 'SpaceGrotesk-Regular',
              textAlign: 'center',
            }}
          >
            Let AI find the perfect track for your mix.
          </Text>
        </View>

        {/* Selectors */}
        {[
          { label: 'Afrobeat, Kompa, Amapiano' },
          { label: 'Energy: High' },
          { label: 'Duration: 4 Hours' },
        ].map((selector, i) => (
          <AnimatedPressable
            key={i}
            onPress={() => console.log(`[AI Assistant] Selector pressed: ${selector.label}`)}
            style={{ marginBottom: 12 }}
          >
            <View
              style={{
                backgroundColor: DJCOLORS.surface,
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontSize: 15,
                  fontFamily: 'SpaceGrotesk-Medium',
                  fontWeight: '500',
                }}
              >
                {selector.label}
              </Text>
              <ChevronDown size={18} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
        ))}

        {/* Get Suggestions Button */}
        <AnimatedPressable onPress={handleGetSuggestions} style={{ marginTop: 8, marginBottom: 28 }}>
          <LinearGradient
            colors={[DJCOLORS.primary, '#C84FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: DJCOLORS.text,
                fontWeight: '800',
                fontSize: 16,
                fontFamily: 'SpaceGrotesk-Bold',
                letterSpacing: 0.5,
              }}
            >
              {loading ? 'ANALYZING...' : 'GET SUGGESTIONS'}
            </Text>
          </LinearGradient>
        </AnimatedPressable>

        {/* Results */}
        {showResults && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: DJCOLORS.text,
                fontFamily: 'SpaceGrotesk-Bold',
                marginBottom: 14,
              }}
            >
              Suggested Tracks
            </Text>
            {RESULTS.map((item, index) => (
              <ResultCard key={item.id} item={item} index={index} />
            ))}

            {/* Energy Mode Buttons */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: DJCOLORS.textSecondary,
                fontFamily: 'SpaceGrotesk-Medium',
                marginTop: 8,
                marginBottom: 12,
              }}
            >
              Adjust Energy
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {ENERGY_MODES.map((mode) => (
                <AnimatedPressable key={mode.id} onPress={() => handleEnergyMode(mode)}>
                  <View
                    style={{
                      backgroundColor: DJCOLORS.surface,
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      borderWidth: 1,
                      borderColor: DJCOLORS.border,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{mode.icon}</Text>
                    <Text
                      style={{
                        color: DJCOLORS.text,
                        fontSize: 12,
                        fontWeight: '600',
                        fontFamily: 'SpaceGrotesk-Bold',
                      }}
                    >
                      {mode.label}
                    </Text>
                  </View>
                </AnimatedPressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
