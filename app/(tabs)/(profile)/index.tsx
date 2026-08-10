import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, ArrowLeft } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const GRID_COLORS = [
  '#2A1A4A', '#1A2A4A', '#1A3A2A',
  '#3A1A2A', '#2A2A1A', '#1A1A3A',
  '#3A2A1A', '#1A3A3A', '#2A1A3A',
];

const TABS = ['POSTS', 'MIXES', 'LIKES'];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const handleBack = () => {
    console.log('[Profile] Back button pressed');
    router.back();
  };

  const handleSettings = () => {
    console.log('[Profile] Settings button pressed');
  };

  const handleEditProfile = () => {
    console.log('[Profile] Edit Profile button pressed');
  };

  const handleShareProfile = () => {
    console.log('[Profile] Share Profile button pressed');
  };

  const handleViewRanking = () => {
    console.log('[Profile] View Full Ranking button pressed → navigating to Ranking');
    router.push('/ranking' as any);
  };

  const handleTabPress = (index: number) => {
    console.log(`[Profile] Tab pressed: ${TABS[index]}`);
    setActiveTab(index);
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
              }}
            >
              <Text style={{ color: DJCOLORS.text, fontSize: 18, fontWeight: '600' }}>←</Text>
            </View>
          </AnimatedPressable>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: 1,
            }}
          >
            PROFILE
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

        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          {/* Avatar */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: DJCOLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: DJCOLORS.accent,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontSize: 28,
                  fontWeight: '800',
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                DJ
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontSize: 20,
                  fontWeight: '800',
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                DJ JHONLYBEST
              </Text>
              <Text style={{ fontSize: 18, color: DJCOLORS.accentBlue }}>✓</Text>
            </View>

            <Text
              style={{
                color: DJCOLORS.textSecondary,
                fontSize: 13,
                fontFamily: 'SpaceGrotesk-Regular',
                marginBottom: 10,
              }}
            >
              PORT-AU-PRINCE, HAITI 🇭🇹
            </Text>

            <View
              style={{
                backgroundColor: DJCOLORS.primaryMuted,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.primary,
                  fontSize: 13,
                  fontWeight: '700',
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                ⭐ 512
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: DJCOLORS.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            {[
              { value: '124', label: 'POSTS' },
              { value: '15.6K', label: 'FOLLOWERS' },
              { value: '2.3K', label: 'FOLLOWING' },
            ].map((stat, i) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRightWidth: i < 2 ? 1 : 0,
                  borderRightColor: DJCOLORS.divider,
                }}
              >
                <Text
                  style={{
                    color: DJCOLORS.text,
                    fontSize: 20,
                    fontWeight: '800',
                    fontFamily: 'SpaceGrotesk-Bold',
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    color: DJCOLORS.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                    fontFamily: 'SpaceGrotesk-Medium',
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Bio */}
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text
              style={{
                color: DJCOLORS.text,
                fontSize: 14,
                lineHeight: 22,
                fontFamily: 'SpaceGrotesk-Regular',
              }}
            >
              DJ / Producer / Creator{'\n'}
              Bringing vibes from Haiti to the world 🌍{'\n'}
              Booking: djjhonlybest@gmail.com
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
            <AnimatedPressable onPress={handleEditProfile} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: DJCOLORS.primaryMuted,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: DJCOLORS.primary,
                }}
              >
                <Text
                  style={{
                    color: DJCOLORS.primary,
                    fontWeight: '700',
                    fontSize: 14,
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  Edit Profile
                </Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable onPress={handleShareProfile} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 14,
                  paddingVertical: 14,
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
                  Share Profile
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Segmented Tabs */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: DJCOLORS.surface,
              borderRadius: 12,
              padding: 4,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            {TABS.map((tab, i) => (
              <AnimatedPressable
                key={tab}
                onPress={() => handleTabPress(i)}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: activeTab === i ? DJCOLORS.primary : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: activeTab === i ? DJCOLORS.text : DJCOLORS.textSecondary,
                      fontWeight: '700',
                      fontSize: 12,
                      fontFamily: 'SpaceGrotesk-Bold',
                      letterSpacing: 0.5,
                    }}
                  >
                    {tab}
                  </Text>
                </View>
              </AnimatedPressable>
            ))}
          </View>

          {/* Post Grid */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 4,
              marginBottom: 24,
            }}
          >
            {GRID_COLORS.map((color, i) => (
              <View
                key={i}
                style={{
                  width: '31.5%',
                  aspectRatio: 1,
                  borderRadius: 8,
                  backgroundColor: color,
                }}
              />
            ))}
          </View>

          {/* View Full Ranking */}
          <AnimatedPressable onPress={handleViewRanking}>
            <View
              style={{
                backgroundColor: DJCOLORS.surface,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.primary,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                View Full Ranking
              </Text>
            </View>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
