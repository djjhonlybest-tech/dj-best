import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const PLANS = [
  {
    id: 'free',
    name: 'FREE',
    price: '$0',
    period: '/month',
    features: [
      'Basic Features',
      'Limited AI Suggestions',
      'DJ Battles',
      'DJ Shorts',
    ],
    highlighted: false,
    borderColor: DJCOLORS.border,
    badgeColor: DJCOLORS.textSecondary,
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '$9.99',
    period: '/month',
    features: [
      'Everything in Free',
      'Unlimited AI Assistant',
      'AI Stems & Track Analysis',
      'Advanced Tools',
      'Unlimited Exports',
    ],
    highlighted: true,
    borderColor: DJCOLORS.primary,
    badgeColor: DJCOLORS.primary,
  },
  {
    id: 'elite',
    name: 'ELITE',
    price: '$19.99',
    period: '/month',
    features: [
      'Everything in Pro',
      'Advanced AI Mixing',
      'Analytics & Promotion Tools',
      'Priority Support',
    ],
    highlighted: false,
    borderColor: DJCOLORS.gold,
    badgeColor: DJCOLORS.gold,
  },
];

export default function PlansScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const handleBack = () => {
    console.log('[Plans] Back button pressed');
    router.back();
  };

  const handleSelectPlan = (planId: string) => {
    console.log(`[Plans] Plan selected: ${planId}`);
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    const plan = PLANS.find((p) => p.id === selectedPlan);
    console.log(`[Plans] Continue button pressed with plan: ${plan?.name} ${plan?.price}`);
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
            marginBottom: 28,
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
                marginRight: 16,
              }}
            >
              <ArrowLeft size={20} color={DJCOLORS.text} />
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
            CHOOSE YOUR PLAN
          </Text>
        </View>

        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          {PLANS.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <AnimatedPressable
                key={plan.id}
                onPress={() => handleSelectPlan(plan.id)}
                style={{ marginBottom: 14 }}
              >
                <View
                  style={{
                    backgroundColor: DJCOLORS.surface,
                    borderRadius: 18,
                    padding: 20,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? plan.borderColor : DJCOLORS.border,
                    boxShadow: isSelected ? `0 4px 20px ${plan.borderColor}20` : undefined,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 14,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{
                          backgroundColor: `${plan.badgeColor}20`,
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: plan.badgeColor,
                            fontWeight: '800',
                            fontSize: 14,
                            fontFamily: 'SpaceGrotesk-Bold',
                            letterSpacing: 0.5,
                          }}
                        >
                          {plan.name}
                        </Text>
                      </View>
                      {plan.highlighted && (
                        <View
                          style={{
                            backgroundColor: DJCOLORS.primary,
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                          }}
                        >
                          <Text
                            style={{
                              color: DJCOLORS.text,
                              fontSize: 10,
                              fontWeight: '700',
                              fontFamily: 'SpaceGrotesk-Bold',
                            }}
                          >
                            POPULAR
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                      <Text
                        style={{
                          color: DJCOLORS.text,
                          fontSize: 22,
                          fontWeight: '800',
                          fontFamily: 'SpaceGrotesk-Bold',
                        }}
                      >
                        {plan.price}
                      </Text>
                      <Text
                        style={{
                          color: DJCOLORS.textSecondary,
                          fontSize: 13,
                          fontFamily: 'SpaceGrotesk-Regular',
                        }}
                      >
                        {plan.period}
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 8 }}>
                    {plan.features.map((feature) => (
                      <View
                        key={feature}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: isSelected ? `${plan.borderColor}20` : DJCOLORS.surfaceSecondary,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check
                            size={12}
                            color={isSelected ? plan.borderColor : DJCOLORS.textTertiary}
                          />
                        </View>
                        <Text
                          style={{
                            color: DJCOLORS.textSecondary,
                            fontSize: 14,
                            fontFamily: 'SpaceGrotesk-Regular',
                          }}
                        >
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Radio indicator */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: isSelected ? plan.borderColor : DJCOLORS.textTertiary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: plan.borderColor,
                        }}
                      />
                    )}
                  </View>
                </View>
              </AnimatedPressable>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
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
        <AnimatedPressable onPress={handleContinue}>
          <LinearGradient
            colors={[DJCOLORS.primary, DJCOLORS.accent]}
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
              CONTINUE
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </View>
    </View>
  );
}
