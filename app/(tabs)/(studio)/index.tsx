import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';

interface GradientSliderProps {
  label: string;
  initialValue?: number;
}

function GradientSlider({ label, initialValue = 0.5 }: GradientSliderProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useRef(new Animated.Value(initialValue)).current;
  const [displayValue, setDisplayValue] = useState(Math.round(initialValue * 100));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log(`[Studio] Slider touched: ${label}`);
      },
      onPanResponderMove: (_, gestureState) => {
        if (sliderWidth === 0) return;
        const currentVal = (position as any)._value;
        const delta = gestureState.dx / sliderWidth;
        const newVal = Math.max(0, Math.min(1, currentVal + delta));
        position.setValue(newVal);
        setDisplayValue(Math.round(newVal * 100));
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text
        style={{
          color: DJCOLORS.textSecondary,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontFamily: 'SpaceGrotesk-Medium',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        style={{
          height: 6,
          backgroundColor: DJCOLORS.surfaceSecondary,
          borderRadius: 3,
          overflow: 'hidden',
        }}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: 3,
            width: position.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: DJCOLORS.accentBlue,
          }}
        />
      </View>
    </View>
  );
}

interface DeckCardProps {
  deckLabel: string;
  trackName: string;
  meta: string;
  thirdButtonLabel: string;
}

function DeckCard({ deckLabel, trackName, meta, thirdButtonLabel }: DeckCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const progressAnim = useRef(new Animated.Value(0.3)).current;

  const handleCue = () => {
    console.log(`[Studio] ${deckLabel} CUE pressed`);
  };

  const handlePlay = () => {
    const next = !isPlaying;
    console.log(`[Studio] ${deckLabel} ${next ? 'PLAY' : 'PAUSE'} pressed`);
    setIsPlaying(next);
  };

  const handleThird = () => {
    console.log(`[Studio] ${deckLabel} ${thirdButtonLabel} pressed`);
  };

  return (
    <View
      style={{
        backgroundColor: DJCOLORS.surface,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: DJCOLORS.border,
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
          marginBottom: 4,
        }}
      >
        {deckLabel}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          color: DJCOLORS.text,
          fontFamily: 'SpaceGrotesk-Bold',
          letterSpacing: -0.3,
          marginBottom: 12,
        }}
      >
        {trackName}
      </Text>

      <WaveformVisualizer height={36} active={isPlaying} />

      <View
        style={{
          height: 5,
          backgroundColor: DJCOLORS.surfaceSecondary,
          borderRadius: 3,
          marginTop: 12,
          marginBottom: 8,
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

      <Text
        style={{
          fontSize: 12,
          color: DJCOLORS.textSecondary,
          fontFamily: 'SpaceGrotesk-Regular',
          marginBottom: 16,
        }}
      >
        {meta}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AnimatedPressable onPress={handleCue} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.surfaceSecondary,
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text
              style={{
                color: DJCOLORS.text,
                fontWeight: '700',
                fontSize: 14,
                fontFamily: 'SpaceGrotesk-Bold',
              }}
            >
              CUE
            </Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable onPress={handlePlay} style={{ flex: 1 }}>
          <LinearGradient
            colors={[DJCOLORS.primary, '#5B8FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Text
              style={{
                color: DJCOLORS.text,
                fontWeight: '700',
                fontSize: 14,
                fontFamily: 'SpaceGrotesk-Bold',
              }}
            >
              {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
            </Text>
          </LinearGradient>
        </AnimatedPressable>

        <AnimatedPressable onPress={handleThird} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.surfaceSecondary,
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text
              style={{
                color: DJCOLORS.text,
                fontWeight: '700',
                fontSize: 14,
                fontFamily: 'SpaceGrotesk-Bold',
              }}
            >
              {thirdButtonLabel}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default function StudioScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    console.log('[Studio] Back button pressed');
    router.back();
  };

  const handleSettings = () => {
    console.log('[Studio] Settings button pressed');
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
              <Text style={{ color: DJCOLORS.text, fontSize: 18, fontWeight: '600' }}>←</Text>
            </View>
          </AnimatedPressable>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: -0.3,
            }}
          >
            DJ Studio
          </Text>

          <AnimatedPressable onPress={handleSettings}>
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
              <Settings size={20} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
        </View>

        {/* Deck A */}
        <DeckCard
          deckLabel="DECK A"
          trackName="Body On Fire"
          meta="108 BPM • 8A"
          thirdButtonLabel="LOOP"
        />

        {/* Deck B */}
        <DeckCard
          deckLabel="DECK B"
          trackName="Love Tonight"
          meta="106 BPM • 8A"
          thirdButtonLabel="SYNC"
        />

        {/* Mixer */}
        <View
          style={{
            backgroundColor: DJCOLORS.surface,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              marginBottom: 20,
            }}
          >
            MIXER
          </Text>

          <View style={{ gap: 20 }}>
            <View style={{ flexDirection: 'row', gap: 24 }}>
              <GradientSlider label="LOW" initialValue={0.6} />
              <GradientSlider label="HIGH" initialValue={0.7} />
            </View>
            <View style={{ flexDirection: 'row', gap: 24 }}>
              <GradientSlider label="MID" initialValue={0.5} />
              <GradientSlider label="CROSSFADER" initialValue={0.45} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
