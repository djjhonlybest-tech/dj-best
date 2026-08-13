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
const COMPETITION_TABS = ['Weekly', 'Monthly', 'Global'];

const COMPETITION_INFO = [
  { title: '🏆 WEEKLY CHAMPION', subtitle: 'Ends Sunday midnight', prize: 'Top DJ Badge + 100 pts' },
  { title: '👑 MONTHLY CHAMPION', subtitle: 'Ends Jan 31', prize: '500 pts + Homepage Feature' },
  { title: '🌎 GLOBAL CHAMPIONSHIP', subtitle: 'Q1 2025', prize: 'DJ BEST LEGEND' },
];

const LIVE_BATTLES = [
  {
    id: '1',
    djA: 'DJ KILLA NY',
    djB: 'DJ JHONLYBEST',
    pctA: 58,
    pctB: 42,
    votes: '12,400',
  },
  {
    id: '2',
    djA: 'DJ SPIN AFRICA',
    djB: 'DJ MAD VIBES',
    pctA: 51,
    pctB: 49,
    votes: '8,900',
  },
];

function BattleCard({ battle, index }: { battle: typeof LIVE_BATTLES[0]; index: number }) {
  const barAWidth = useRef(new Animated.Value(0)).current;
  const barBWidth = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, delay: index * 150, useNativeDriver: true }),
      Animated.spring(barAWidth, { toValue: battle.pctA, delay: 300 + index * 150, useNativeDriver: false, speed: 6, bounciness: 2 }),
      Animated.spring(barBWidth, { toValue: battle.pctB, delay: 300 + index * 150, useNativeDriver: false, speed: 6, bounciness: 2 }),
    ]).start();
  }, []);

  const handleVote = (dj: string) => {
    console.log(`[Ranking] Vote pressed for ${dj} in battle ${battle.id}`);
  };

  const pctADisplay = `${battle.pctA}%`;
  const pctBDisplay = `${battle.pctB}%`;

  return (
    <Animated.View style={{ opacity: cardOpacity, marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: '#1A0505',
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: `${DJCOLORS.danger}55`,
        }}
      >
        {/* VS header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ color: DJCOLORS.text, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', flex: 1 }} numberOfLines={1}>
            {battle.djA}
          </Text>
          <View
            style={{
              backgroundColor: DJCOLORS.danger,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
              marginHorizontal: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>VS</Text>
          </View>
          <Text style={{ color: DJCOLORS.text, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', flex: 1, textAlign: 'right' }} numberOfLines={1}>
            {battle.djB}
          </Text>
        </View>

        {/* Vote bars */}
        <View style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={{ flex: 1, height: 8, backgroundColor: DJCOLORS.surfaceSecondary, borderRadius: 4, overflow: 'hidden' }}>
              <Animated.View
                style={{
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: DJCOLORS.primary,
                  width: barAWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                }}
              />
            </View>
            <Text style={{ color: DJCOLORS.primary, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold', width: 36, textAlign: 'right' }}>
              {pctADisplay}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flex: 1, height: 8, backgroundColor: DJCOLORS.surfaceSecondary, borderRadius: 4, overflow: 'hidden' }}>
              <Animated.View
                style={{
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: DJCOLORS.accent,
                  width: barBWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                }}
              />
            </View>
            <Text style={{ color: DJCOLORS.accent, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold', width: 36, textAlign: 'right' }}>
              {pctBDisplay}
            </Text>
          </View>
        </View>

        {/* Votes + Vote buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Regular', flex: 1 }}>
            {battle.votes} votes
          </Text>
          <AnimatedPressable onPress={() => handleVote(battle.djA)}>
            <View
              style={{
                backgroundColor: DJCOLORS.danger,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
                VOTE
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </Animated.View>
  );
}

function Top3Card({ dj, index }: { dj: typeof TOP3[0]; index: number }) {
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemOpacity, { toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true }),
      Animated.spring(itemScale, { toValue: 1, delay: index * 100, useNativeDriver: true, speed: 12, bounciness: 4 }),
    ]).start();
  }, []);

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
          <Text style={{ color: DJCOLORS.text, fontWeight: '800', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 2 }}>
            {dj.name}
          </Text>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Regular' }}>
            {dj.location}
          </Text>
        </View>
        <View style={{ backgroundColor: `${dj.color}20`, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: dj.color, fontWeight: '800', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', fontVariant: ['tabular-nums'] }}>
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
      Animated.timing(itemOpacity, { toValue: 1, duration: 300, delay: 300 + index * 60, useNativeDriver: true }),
      Animated.timing(itemTranslate, { toValue: 0, duration: 300, delay: 300 + index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

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
          <Text style={{ color: DJCOLORS.textSecondary, fontWeight: '700', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>
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
          <Text style={{ color: DJCOLORS.text, fontWeight: '700', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 1 }}>
            {dj.name}
          </Text>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Regular' }}>
            {dj.location}
          </Text>
        </View>
        <Text style={{ color: DJCOLORS.primary, fontWeight: '700', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', fontVariant: ['tabular-nums'] }}>
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
  const [activeCompTab, setActiveCompTab] = useState(0);

  // Championship banner animation
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bannerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(bannerScale, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 4 }),
    ]).start();
  }, []);

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

  const handleCompTabPress = (index: number) => {
    console.log(`[Ranking] Competition tab pressed: ${COMPETITION_TABS[index]}`);
    setActiveCompTab(index);
  };

  const handleViewFull = () => {
    console.log('[Ranking] View Full Ranking button pressed');
  };

  const handleJoinChampionship = () => {
    console.log('[Ranking] JOIN NOW championship button pressed');
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
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

          <Text style={{ fontSize: 18, fontWeight: '800', color: DJCOLORS.text, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.5 }}>
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

        {/* ── CHAMPIONSHIP BANNER ── */}
        <Animated.View style={{ opacity: bannerOpacity, transform: [{ scale: bannerScale }], marginBottom: 20 }}>
          <LinearGradient
            colors={[DJCOLORS.gold, '#FF8C00', '#FF6B00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#0A0A0F', fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.3, marginBottom: 4 }}>
                  🏆 GLOBAL DJ CHAMPIONSHIP
                </Text>
                <Text style={{ color: 'rgba(10,10,15,0.7)', fontSize: 13, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 10 }}>
                  Q1 2025 • 847 DJs competing
                </Text>
                <Text style={{ color: '#0A0A0F', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 12 }}>
                  💵 $5,000 + DJVERSE LEGEND title
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(10,10,15,0.2)',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: '#0A0A0F', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
                  23 DAYS LEFT
                </Text>
              </View>
            </View>
            <AnimatedPressable onPress={handleJoinChampionship}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FF8C00', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.5 }}>
                  JOIN NOW →
                </Text>
              </View>
            </AnimatedPressable>
          </LinearGradient>
        </Animated.View>

        {/* Segmented Tabs */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: DJCOLORS.surface,
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
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

        {/* Competition Tiers */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            {COMPETITION_TABS.map((tab, i) => {
              const isActive = activeCompTab === i;
              return (
                <AnimatedPressable key={tab} onPress={() => handleCompTabPress(i)}>
                  <View
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: isActive ? DJCOLORS.gold : DJCOLORS.surface,
                      borderWidth: 1,
                      borderColor: isActive ? DJCOLORS.gold : DJCOLORS.border,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: isActive ? '#0A0A0F' : DJCOLORS.textSecondary }}>
                      {tab}
                    </Text>
                  </View>
                </AnimatedPressable>
              );
            })}
          </View>

          {/* Competition info card */}
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text, marginBottom: 4 }}>
              {COMPETITION_INFO[activeCompTab].title}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Regular', color: DJCOLORS.textSecondary, marginBottom: 12 }}>
              {COMPETITION_INFO[activeCompTab].subtitle}
            </Text>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: `${DJCOLORS.gold}22`,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: `${DJCOLORS.gold}55`,
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.gold }}>
                🏅 {COMPETITION_INFO[activeCompTab].prize}
              </Text>
            </View>
          </View>

          {/* ── LIVE BATTLES ── */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text, marginBottom: 14 }}>
              ⚔️ LIVE BATTLES
            </Text>
            {LIVE_BATTLES.map((battle, index) => (
              <BattleCard key={battle.id} battle={battle} index={index} />
            ))}
          </View>
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
            style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
          >
            <Text style={{ color: DJCOLORS.text, fontWeight: '800', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.5 }}>
              VIEW FULL RANKING
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}
