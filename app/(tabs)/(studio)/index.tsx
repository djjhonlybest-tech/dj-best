import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';

// ─── Pitch Slider ─────────────────────────────────────────────────────────────

interface PitchSliderProps {
  label: string;
  initialValue?: number;
}

function PitchSlider({ label, initialValue = 0.5 }: PitchSliderProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useRef(new Animated.Value(initialValue)).current;
  const [displayValue, setDisplayValue] = useState(
    Math.round((initialValue - 0.5) * 12)
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log(`[Studio] ${label} slider touched`);
      },
      onPanResponderMove: (_, gestureState) => {
        if (sliderWidth === 0) return;
        const currentVal = (position as any)._value;
        const delta = gestureState.dx / sliderWidth;
        const newVal = Math.max(0, Math.min(1, currentVal + delta));
        position.setValue(newVal);
        setDisplayValue(Math.round((newVal - 0.5) * 12));
      },
    })
  ).current;

  const sign = displayValue > 0 ? '+' : '';
  const displayText = `${sign}${displayValue}`;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1 }}>
          {label}
        </Text>
        <Text style={{ color: DJCOLORS.accentBlue, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold' }}>
          {displayText}
        </Text>
      </View>
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
            width: position.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            backgroundColor: DJCOLORS.accentBlue,
          }}
        />
      </View>
    </View>
  );
}

// ─── EQ Knob ──────────────────────────────────────────────────────────────────

interface EQKnobProps {
  label: string;
  color?: string;
}

function EQKnob({ label, color = DJCOLORS.primary }: EQKnobProps) {
  const [value, setValue] = useState(0);

  const handleMinus = () => {
    const next = Math.max(-12, value - 1);
    console.log(`[Studio] EQ ${label} decreased to ${next}`);
    setValue(next);
  };

  const handlePlus = () => {
    const next = Math.min(12, value + 1);
    console.log(`[Studio] EQ ${label} increased to ${next}`);
    setValue(next);
  };

  const sign = value > 0 ? '+' : '';
  const displayVal = `${sign}${value}`;

  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Text style={{ color: DJCOLORS.textSecondary, fontSize: 9, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1 }}>
        {label}
      </Text>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: DJCOLORS.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: `${color}55`,
        }}
      >
        <Text style={{ color, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>
          {displayVal}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <AnimatedPressable onPress={handleMinus}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: DJCOLORS.surfaceSecondary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text style={{ color: DJCOLORS.text, fontSize: 14, lineHeight: 18 }}>−</Text>
          </View>
        </AnimatedPressable>
        <AnimatedPressable onPress={handlePlus}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: DJCOLORS.surfaceSecondary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text style={{ color: DJCOLORS.text, fontSize: 14, lineHeight: 18 }}>+</Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

// ─── Crossfader ───────────────────────────────────────────────────────────────

function Crossfader() {
  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useRef(new Animated.Value(0.5)).current;
  const [displayValue, setDisplayValue] = useState(50);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('[Studio] Crossfader touched');
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
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ color: DJCOLORS.primary, fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>A</Text>
        <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1 }}>
          CROSSFADER
        </Text>
        <Text style={{ color: DJCOLORS.accent, fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>B</Text>
      </View>
      <View
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        style={{
          height: 8,
          backgroundColor: DJCOLORS.surfaceSecondary,
          borderRadius: 4,
          overflow: 'hidden',
        }}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            borderRadius: 4,
            width: position.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            backgroundColor: DJCOLORS.primary,
          }}
        />
      </View>
    </View>
  );
}

// ─── Deck ─────────────────────────────────────────────────────────────────────

interface DeckProps {
  label: string;
  trackName: string;
  artist: string;
  bpm: number;
  key: string;
  accentColor: string;
}

function Deck({ label, trackName, artist, bpm, key: musicalKey, accentColor }: DeckProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const handleCue = () => {
    console.log(`[Studio] ${label} CUE pressed`);
  };

  const handlePlay = () => {
    const next = !isPlaying;
    console.log(`[Studio] ${label} ${next ? 'PLAY' : 'PAUSE'} pressed`);
    setIsPlaying(next);
  };

  const handleLoop = () => {
    const next = !isLooping;
    console.log(`[Studio] ${label} LOOP ${next ? 'ON' : 'OFF'}`);
    setIsLooping(next);
  };

  const handleSync = () => {
    console.log(`[Studio] ${label} SYNC pressed`);
  };

  return (
    <View
      style={{
        backgroundColor: DJCOLORS.surface,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: isPlaying ? `${accentColor}55` : DJCOLORS.border,
        flex: 1,
      }}
    >
      {/* Deck label + badges */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: `${accentColor}22`,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderWidth: 1,
            borderColor: `${accentColor}55`,
          }}
        >
          <Text style={{ color: accentColor, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1 }}>
            {label}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={{ backgroundColor: DJCOLORS.surfaceSecondary, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
            <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold' }}>
              {bpm} BPM
            </Text>
          </View>
          <View style={{ backgroundColor: DJCOLORS.surfaceSecondary, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
            <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold' }}>
              {musicalKey}
            </Text>
          </View>
        </View>
      </View>

      {/* Track info */}
      <Text style={{ color: DJCOLORS.text, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 1 }} numberOfLines={1}>
        {trackName}
      </Text>
      <Text style={{ color: DJCOLORS.textSecondary, fontSize: 11, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 8 }} numberOfLines={1}>
        {artist}
      </Text>

      {/* Waveform */}
      <View style={{ marginBottom: 10 }}>
        <WaveformVisualizer height={32} active={isPlaying} />
      </View>

      {/* Pitch slider */}
      <View style={{ marginBottom: 10 }}>
        <PitchSlider label="PITCH" initialValue={0.5} />
      </View>

      {/* Transport controls */}
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <AnimatedPressable onPress={handleCue} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.surfaceSecondary,
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text style={{ color: DJCOLORS.text, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>|◀</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable onPress={handlePlay} style={{ flex: 2 }}>
          <LinearGradient
            colors={isPlaying ? [DJCOLORS.accent, '#FF8C00'] : [accentColor, DJCOLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>
              {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
            </Text>
          </LinearGradient>
        </AnimatedPressable>

        <AnimatedPressable onPress={handleLoop} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: isLooping ? `${DJCOLORS.accentBlue}22` : DJCOLORS.surfaceSecondary,
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: isLooping ? DJCOLORS.accentBlue : DJCOLORS.border,
            }}
          >
            <Text style={{ color: isLooping ? DJCOLORS.accentBlue : DJCOLORS.text, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>↺</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable onPress={handleSync} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.surfaceSecondary,
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text style={{ color: DJCOLORS.text, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>⟳</Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

const EFFECTS = ['REVERB', 'ECHO', 'FLANGER', 'FILTER'];

export default function StudioScreen() {
  const insets = useSafeAreaInsets();
  const [bpm, setBpm] = useState(108);
  const [isSynced, setIsSynced] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  const handleSync = () => {
    const next = !isSynced;
    console.log(`[Studio] SYNC ${next ? 'ON' : 'OFF'}`);
    setIsSynced(next);
  };

  const handleEffect = (effect: string) => {
    const isActive = activeEffects.includes(effect);
    console.log(`[Studio] Effect ${effect} ${isActive ? 'OFF' : 'ON'}`);
    setActiveEffects((prev) =>
      isActive ? prev.filter((e) => e !== effect) : [...prev, effect]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background, paddingTop: insets.top }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: DJCOLORS.border,
        }}
      >
        <Text style={{ fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text }}>
          🎛️ DJ STUDIO
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.surfaceSecondary,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text style={{ color: DJCOLORS.accentBlue, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
              {bpm} BPM
            </Text>
          </View>
          <AnimatedPressable onPress={handleSync}>
            <View
              style={{
                backgroundColor: isSynced ? DJCOLORS.primary : DJCOLORS.surfaceSecondary,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: isSynced ? DJCOLORS.primary : DJCOLORS.border,
              }}
            >
              <Text style={{ color: isSynced ? '#fff' : DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
                SYNC
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>

      {/* Decks */}
      <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 12, paddingTop: 10, gap: 8 }}>
        <Deck
          label="DECK A"
          trackName="Body On Fire"
          artist="DJ JHONLYBEST"
          bpm={108}
          key="8A"
          accentColor={DJCOLORS.primary}
        />

        {/* Mixer strip */}
        <View
          style={{
            backgroundColor: DJCOLORS.surface,
            borderRadius: 14,
            padding: 12,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <EQKnob label="LOW" color={DJCOLORS.accentBlue} />
            <EQKnob label="MID" color={DJCOLORS.primary} />
            <EQKnob label="HIGH" color={DJCOLORS.accent} />
            <EQKnob label="FILTER" color={DJCOLORS.gold} />
            <View style={{ flex: 1 }}>
              <Crossfader />
            </View>
          </View>
        </View>

        <Deck
          label="DECK B"
          trackName="Love Tonight"
          artist="DJ NOVA"
          bpm={106}
          key="8A"
          accentColor={DJCOLORS.accent}
        />

        {/* Effects row */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            paddingBottom: insets.bottom + 8,
          }}
        >
          {EFFECTS.map((effect) => {
            const isActive = activeEffects.includes(effect);
            return (
              <AnimatedPressable key={effect} onPress={() => handleEffect(effect)} style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: isActive ? DJCOLORS.primaryMuted : DJCOLORS.surface,
                    borderRadius: 10,
                    paddingVertical: 10,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: isActive ? DJCOLORS.primary : DJCOLORS.border,
                  }}
                >
                  <Text
                    style={{
                      color: isActive ? DJCOLORS.primary : DJCOLORS.textSecondary,
                      fontSize: 10,
                      fontFamily: 'SpaceGrotesk-Bold',
                      letterSpacing: 0.5,
                    }}
                  >
                    {effect}
                  </Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
