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
import { ArrowLeft, Search } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const TOP3 = [
  { rank: 1, name: 'DJ KILLA NY', flag: '🇺🇸', location: 'New York, USA', points: '24.8K', medal: '🥇', color: DJCOLORS.gold },
  { rank: 2, name: 'DJ JHONLYBEST', flag: '🇭🇹', location: 'Port-au-Prince, HA', points: '21.6K', medal: '🥈', color: '#C0C0C0' },
  { rank: 3, name: 'DJ SPIN AFRICA', flag: '🇳🇬', location: 'Lagos, Nigeria', points: '19.2K', medal: '🥉', color: '#CD7F32' },
];

const RANKED_LIST = [
  { rank: 4, name: 'DJ MAD VIBES', flag: '🇬🇧', location: 'London, UK', points: '17.5K' },
  { rank: 5, name: 'DJ KOMPAMIX', flag: '🇺🇸', location: 'Miami, USA', points: '15.9K' },
  { rank: 6, name: 'DJ AFRO KING', flag: '🇬🇭', location: 'Accra, Ghana', points: '14.2K' },
  { rank: 7, name: 'DJ PARIS NIGHT', flag: '🇫🇷', location: 'Paris, France', points: '12.8K' },
  { rank: 8, name: 'DJ TOKYO WAVE', flag: '🇯🇵', location: 'Tokyo, Japan', points: '11.4K' },
  { rank: 9, name: 'DJ SAMBA FIRE', flag: '🇧🇷', location: 'São Paulo, Brazil', points: '10.1K' },
  { rank: 10, name: 'DJ CAPE TOWN', flag: '🇿🇦', location: 'Cape Town, SA', points: '9.3K' },
];

const TABS = ['DJS', 'BATTLES', 'SHORTS'];

function Top3Card({ dj, index }: { dj: typeof TOP3[0]; index: number }) {
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemOpacity, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(itemScale, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        speed: 12,
        bounciness: 4,
      }),
    ]).start();
  }, [itemOpacity, itemScale, index]);

  return (
    <Animated.View style={{ opacity: itemOpacity, transform: [{ scale: itemScale }] }}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: dj.rank === 1 ? `${DJCOLORS.gold}40` : DJCOLORS.border,
        }}
      >
        <Text style={{ fontSize: 28, marginRight: 14 }}>{dj.medal}</Text>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: DJCOLORS.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
            borderWidth: 2,
            borderColor: dj.color,
          }}
        >
          <Text style={{ fontSize: 24 }}>{dj.flag}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: DJCOLORS.text,
              fontWeight: '800',
              fontSize: 15,
              fontFamily: 'SpaceGrotesk-Bold',
              marginBottom: 2,
            }}
          >
            {dj.name}
          </Text>
          <Text
            style={{
              color: DJCOLORS.textSecondary,
              fontSize: 12,
              fontFamily: 'SpaceGrotesk-Regular',
            }}
          >
            {dj.location}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: `${dj.color}20`,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              color: dj.color,
              fontWeight: '800',
              fontSize: 14,
              fontFamily: 'SpaceGrotesk-Bold',
              fontVariant: ['tabular-nums'],
            }}
          >
            {dj.points}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function RankedListItem({ dj, index }: { dj: typeof RANKED_LIST[0]; index: number }) {
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemTranslate = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300 + index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(itemTranslate, {
        toValue: 0,
        duration: 300,
        delay: 300 + index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [itemOpacity, itemTranslate, index]);

  return (
    <Animated.View style={{ opacity: itemOpacity, transform: [{ translateY: itemTranslate }] }}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 12,
          padding: 14,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: DJCOLORS.border,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: DJCOLORS.surfaceSecondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text
            style={{
              color: DJCOLORS.textSecondary,
              fontWeight: '700',
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
            }}
          >
            {dj.rank}
          </Text>
        </View>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: DJCOLORS.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 20 }}>{dj.flag}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: DJCOLORS.text,
              fontWeight: '700',
              fontSize: 14,
              fontFamily: 'SpaceGrotesk-Bold',
              marginBottom: 1,
            }}
          >
            {dj.name}
          </Text>
          <Text
            style={{
              color: DJCOLORS.textSecondary,
              fontSize: 12,
              fontFamily: 'SpaceGrotesk-Regular',
            }}
          >
            {dj.location}
          </Text>
        </View>
        <Text
          style={{
            color: DJCOLORS.primary,
            fontWeight: '700',
            fontSize: 14,
            fontFamily: 'SpaceGrotesk-Bold',
            fontVariant: ['tabular-nums'],
          }}
        >
          {dj.points}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function RankingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleBack = () => {
    console.log('[Ranking] Back button pressed');
    router.back();
  };

  const handleSearch = () => {
    console.log('[Ranking] Search button pressed');
  };

  const handleTabPress = (index: number) => {
    console.log(`[Ranking] Tab pressed: ${TABS[index]}`);
    setActiveTab(index);
  };

  const handleViewFull = () => {
    console.log('[Ranking] View Full Ranking button pressed');
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
              <ArrowLeft size={20} color={DJCOLORS.text} />
            </View>
          </AnimatedPressable>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: 0.5,
            }}
          >
            GLOBAL RANKING
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

        {/* Segmented Tabs */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: DJCOLORS.surface,
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
          }}
        >
          {TABS.map((tab, i) => (
            <AnimatedPressable key={tab} onPress={() => handleTabPress(i)} style={{ flex: 1 }}>
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
                    fontSize: 13,
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

        {/* Top 3 Podium */}
        <View style={{ marginBottom: 24 }}>
          {TOP3.map((dj, index) => (
            <Top3Card key={dj.rank} dj={dj} index={index} />
          ))}
        </View>

        {/* Ranked List #4-10 */}
        {RANKED_LIST.map((dj, index) => (
          <RankedListItem key={dj.rank} dj={dj} index={index} />
        ))}

        {/* View Full Ranking */}
        <AnimatedPressable onPress={handleViewFull} style={{ marginTop: 8 }}>
          <LinearGradient
            colors={[DJCOLORS.accentBlue, DJCOLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: DJCOLORS.text,
                fontWeight: '800',
                fontSize: 15,
                fontFamily: 'SpaceGrotesk-Bold',
                letterSpacing: 0.5,
              }}
            >
              VIEW FULL RANKING
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}
