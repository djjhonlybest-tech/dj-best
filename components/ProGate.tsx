import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useProContext } from '@/contexts/ProContext';

const { width } = Dimensions.get('window');

interface ProGateProps {
  /** If true, the gate is active (user is not pro). */
  active: boolean;
}

export function ProGate({ active }: ProGateProps) {
  const { upgradeToPro } = useProContext();
  const [dismissed, setDismissed] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    if (active && !dismissed) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 80,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [active, dismissed, opacity, scale]);

  // Reset dismissed state when active changes to true
  useEffect(() => {
    if (active) {
      setDismissed(false);
    }
  }, [active]);

  if (!active || dismissed) return null;

  const handleUpgrade = () => {
    console.log('[ProGate] UPGRADE TO PRO button pressed');
    upgradeToPro();
  };

  const handleDismiss = () => {
    console.log('[ProGate] Maybe Later pressed — dismissing overlay for session');
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setDismissed(true));
  };

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="box-none">
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Lock icon */}
        <View style={styles.lockCircle}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>DJ PRO REQUIRED</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Unlock your full DJ page, booking, tips, analytics and more.
        </Text>

        {/* Upgrade button */}
        <AnimatedPressable onPress={handleUpgrade} style={styles.buttonWrapper}>
          <LinearGradient
            colors={[DJCOLORS.gold, '#FF9500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeText}>UPGRADE TO PRO</Text>
          </LinearGradient>
        </AnimatedPressable>

        {/* Maybe Later */}
        <AnimatedPressable onPress={handleDismiss}>
          <Text style={styles.maybeLater}>Maybe Later</Text>
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 15, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    width: width - 48,
    backgroundColor: DJCOLORS.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${DJCOLORS.gold}44`,
    shadowColor: DJCOLORS.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${DJCOLORS.gold}18`,
    borderWidth: 2,
    borderColor: `${DJCOLORS.gold}55`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockIcon: {
    fontSize: 32,
  },
  title: {
    color: DJCOLORS.text,
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: DJCOLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  upgradeButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeText: {
    color: '#0A0A0F',
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: '800',
    letterSpacing: 1,
  },
  maybeLater: {
    color: DJCOLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    textDecorationLine: 'underline',
    paddingVertical: 4,
  },
});
