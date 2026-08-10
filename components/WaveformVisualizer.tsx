import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { DJCOLORS } from '@/constants/djverse-colors';

const BAR_COUNT = 40;
const BAR_HEIGHTS = [
  12, 20, 28, 16, 24, 32, 18, 26, 14, 30,
  22, 10, 28, 20, 16, 32, 24, 12, 26, 18,
  30, 14, 22, 28, 16, 20, 32, 10, 24, 18,
  26, 12, 30, 22, 16, 28, 20, 14, 24, 32,
];

interface WaveformVisualizerProps {
  height?: number;
  active?: boolean;
}

export function WaveformVisualizer({ height = 40, active = true }: WaveformVisualizerProps) {
  const animations = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.4))
  ).current;

  useEffect(() => {
    if (!active) return;

    const loops = animations.map((anim, i) => {
      const baseHeight = BAR_HEIGHTS[i] / 32;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: baseHeight,
            duration: 400 + (i % 7) * 80,
            delay: i * 20,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 400 + (i % 5) * 80,
            useNativeDriver: true,
          }),
        ])
      );
    });

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [active, animations]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        height,
        gap: 2,
      }}
    >
      {animations.map((anim, i) => {
        const maxH = BAR_HEIGHTS[i];
        const color = i % 3 === 0 ? DJCOLORS.accentBlue : i % 3 === 1 ? DJCOLORS.primary : DJCOLORS.accent;
        return (
          <Animated.View
            key={i}
            style={{
              width: 3,
              height: maxH,
              borderRadius: 2,
              backgroundColor: color,
              transform: [{ scaleY: anim }],
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </View>
  );
}
