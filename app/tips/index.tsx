import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const MOCK_TIPS = [
  { id: '1', sender: 'MARIE', initials: 'MA', color: '#FF4FC8', amount: '$25.00', message: 'Amazing set tonight! 🔥', time: '2h ago' },
  { id: '2', sender: 'FANATIC_BEATS', initials: 'FB', color: '#4FC8FF', amount: '$10.00', message: 'Keep doing your thing!', time: '3h ago' },
  { id: '3', sender: 'PARTY_QUEEN', initials: 'PQ', color: '#34D399', amount: '$50.00', message: 'Best DJ on the platform 🏆', time: '5h ago' },
  { id: '4', sender: 'DJ_FAN_01', initials: 'DF', color: '#FFB800', amount: '$5.00', message: 'Love the Kompa vibes!', time: '8h ago' },
  { id: '5', sender: 'MUSIC_LOVER', initials: 'ML', color: '#7B4FFF', amount: '$15.00', message: 'That transition was insane 😱', time: '1d ago' },
  { id: '6', sender: 'KOMPA_FAN', initials: 'KF', color: '#FF4F4F', amount: '$20.00', message: 'Haiti represent! 🇭🇹', time: '1d ago' },
  { id: '7', sender: 'NIGHT_OWL', initials: 'NO', color: '#4FFF8A', amount: '$100.00', message: 'You made my night!', time: '2d ago' },
  { id: '8', sender: 'VIBE_CHECK', initials: 'VC', color: '#FF8C00', amount: '$22.50', message: 'Straight fire 🔥🔥', time: '3d ago' },
];

function TipItem({ tip, index }: { tip: typeof MOCK_TIPS[0]; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 350, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderWidth: 1,
          borderColor: DJCOLORS.border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: tip.color,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>
            {tip.initials}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ color: DJCOLORS.text, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
              {tip.sender}
            </Text>
            <Text style={{ color: DJCOLORS.gold, fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' }}>
              {tip.amount}
            </Text>
          </View>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 3 }} numberOfLines={1}>
            {tip.message}
          </Text>
          <Text style={{ color: DJCOLORS.textTertiary, fontSize: 11, fontFamily: 'SpaceGrotesk-Regular' }}>
            {tip.time}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function TipsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tipsEnabled, setTipsEnabled] = useState(true);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBack = () => {
    console.log('[Tips] Back button pressed');
    router.back();
  };

  const handleToggleTips = (value: boolean) => {
    console.log(`[Tips] Tips ${value ? 'enabled' : 'disabled'}`);
    setTipsEnabled(value);
  };

  const handleWithdraw = () => {
    console.log('[Tips] Withdraw $247.50 button pressed');
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
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
                marginRight: 16,
              }}
            >
              <ArrowLeft size={20} color={DJCOLORS.text} />
            </View>
          </AnimatedPressable>
          <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text, letterSpacing: -0.3 }}>
            💰 TIPS
          </Text>
        </View>

        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          {/* Enable Tips toggle */}
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: tipsEnabled ? `${DJCOLORS.gold}44` : DJCOLORS.border,
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: DJCOLORS.text, fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 3 }}>
                Enable Tips
              </Text>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
                Allow fans to send you tips during Lives and posts
              </Text>
            </View>
            <Switch
              value={tipsEnabled}
              onValueChange={handleToggleTips}
              trackColor={{ false: DJCOLORS.surfaceSecondary, true: DJCOLORS.gold }}
              thumbColor={tipsEnabled ? '#fff' : DJCOLORS.textTertiary}
            />
          </View>

          {/* Earnings summary */}
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginBottom: 24,
            }}
          >
            {[
              { label: 'Total Earned', value: '$247.50', color: DJCOLORS.gold },
              { label: 'This Month', value: '$89.00', color: DJCOLORS.primary },
              { label: 'Pending', value: '$12.50', color: DJCOLORS.accentBlue },
            ].map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: `${stat.color}33`,
                  gap: 4,
                }}
              >
                <Text style={{ color: stat.color, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', fontVariant: ['tabular-nums'] }}>
                  {stat.value}
                </Text>
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Medium', textAlign: 'center', letterSpacing: 0.3 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Recent tips */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 14 }}>
            RECENT TIPS
          </Text>
          {MOCK_TIPS.map((tip, index) => (
            <TipItem key={tip.id} tip={tip} index={index} />
          ))}
        </Animated.View>
      </ScrollView>

      {/* Withdraw button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 16,
          backgroundColor: DJCOLORS.background,
          borderTopWidth: 1,
          borderTopColor: DJCOLORS.border,
        }}
      >
        <AnimatedPressable onPress={handleWithdraw}>
          <LinearGradient
            colors={[DJCOLORS.gold, '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
          >
            <Text style={{ color: '#0A0A0F', fontWeight: '800', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.5 }}>
              WITHDRAW $247.50
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </View>
    </View>
  );
}
