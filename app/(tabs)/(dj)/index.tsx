import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Data ────────────────────────────────────────────────────────────────────

const GENRE_CARDS = [
  { genre: 'Kompa', bpm: '100-110 BPM', color: '#0A1A3A', emoji: '🎷' },
  { genre: 'Afrobeat', bpm: '120-128 BPM', color: '#1A0A3A', emoji: '🥁' },
  { genre: 'Rabòday', bpm: '95-105 BPM', color: '#3A0A0A', emoji: '🔥' },
  { genre: 'Amapiano', bpm: '112-116 BPM', color: '#2A0A2A', emoji: '🎹' },
  { genre: 'Dancehall', bpm: '90-100 BPM', color: '#1A2A0A', emoji: '🌴' },
  { genre: 'House', bpm: '124-132 BPM', color: '#0A2A2A', emoji: '🏠' },
];

const MIX_UPLOAD_FEATURES = [
  { icon: '📤', label: 'Upload Mix', sub: 'Share your full set' },
  { icon: '🎵', label: 'Add Tracklist', sub: 'Tag every track' },
  { icon: '🌍', label: 'Set Genre', sub: 'Afrobeat, Kompa...' },
  { icon: '📊', label: 'View Stats', sub: 'Plays, likes, shares' },
];

const HAITIAN_DJS = [
  { name: 'DJ JHONLYBEST', genre: 'Kompa • Afrobeat', flag: '🇭🇹', color: '#1A0A3A', rank: '#3' },
  { name: 'DJ KOMPA KING', genre: 'Kompa • Caribbean', flag: '🇭🇹', color: '#0A1A3A', rank: '#1' },
  { name: 'DJ STORM', genre: 'Rabòday • Hip-Hop', flag: '🇭🇹', color: '#3A0A0A', rank: '#5' },
  { name: 'DJ NOVA', genre: 'Afro-Kompa', flag: '🇭🇹', color: '#1A2A0A', rank: '#8' },
];

const UPCOMING_BATTLES = [
  { title: 'Caribbean Showdown', time: 'Tomorrow 9PM', participants: 'DJ NOVA vs DJ BEATS' },
  { title: 'Afrobeat Masters', time: 'Dec 28 8PM', participants: 'DJ JHONLYBEST vs DJ STORM' },
];

const RANKING_TOP3 = [
  { rank: '#1', name: 'DJ KOMPA KING', followers: '31.4K', color: DJCOLORS.gold, medal: '🥇' },
  { rank: '#2', name: 'DJ STORM', followers: '23.1K', color: '#C0C0C0', medal: '🥈' },
  { rank: '#3', name: 'DJ JHONLYBEST', followers: '15.6K', color: '#CD7F32', medal: '🥉' },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DJHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSettings = () => {
    console.log('[DJ Hub] Settings pressed');
  };

  const handleAIAssistant = () => {
    console.log('[DJ Hub] AI DJ Assistant pressed → navigating to /ai-assistant');
    router.push('/ai-assistant' as any);
  };

  const handleStudio = () => {
    console.log('[DJ Hub] Studio pressed');
    router.push('/(tabs)/(studio)' as any);
  };

  const handleGenrePress = (genre: string) => {
    console.log(`[DJ Hub] Genre card pressed: ${genre}`);
  };

  const handleVoteNow = () => {
    console.log('[DJ Hub] Vote Now pressed → navigating to battle');
    router.push('/(tabs)/(battle)' as any);
  };

  const handleUpcomingBattle = (title: string) => {
    console.log(`[DJ Hub] Upcoming battle pressed: ${title}`);
  };

  const handleSeeFullRanking = () => {
    console.log('[DJ Hub] See Full Ranking pressed → navigating to /ranking');
    router.push('/ranking' as any);
  };

  const handleRankingDJ = (name: string) => {
    console.log(`[DJ Hub] Ranking DJ pressed: ${name}`);
  };

  const handleMixFeature = (label: string) => {
    console.log(`[DJ Hub] Mix feature pressed: ${label}`);
  };

  const handleHaitianDJ = (name: string) => {
    console.log(`[DJ Hub] Haitian DJ spotlight pressed: ${name}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
            }}
          >
            🎧 DJ HUB
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

        {/* AI DJ Assistant */}
        <AnimatedPressable onPress={handleAIAssistant} style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <LinearGradient
            colors={[DJCOLORS.primary, DJCOLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: 1.5,
                fontFamily: 'SpaceGrotesk-Bold',
                marginBottom: 6,
              }}
            >
              🤖 AI DJ ASSISTANT
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'SpaceGrotesk-Bold',
                color: '#fff',
                marginBottom: 4,
              }}
            >
              What should I play next?
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'SpaceGrotesk-Regular',
                marginBottom: 16,
              }}
            >
              Body On Fire • 108 BPM • 8A
            </Text>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.primary,
                }}
              >
                GET SUGGESTIONS →
              </Text>
            </View>
          </LinearGradient>
        </AnimatedPressable>

        {/* DJ Studio */}
        <AnimatedPressable onPress={handleStudio} style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: DJCOLORS.primaryMuted,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Text style={{ fontSize: 22 }}>🎛️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.text,
                  marginBottom: 3,
                }}
              >
                DJ STUDIO
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Regular',
                  color: DJCOLORS.textSecondary,
                }}
              >
                Deck A • Deck B • Mixer • Effects
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SpaceGrotesk-Bold',
                color: DJCOLORS.primary,
              }}
            >
              Open →
            </Text>
          </View>
        </AnimatedPressable>

        {/* Music Discovery */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              letterSpacing: 1,
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            🎵 MUSIC DISCOVERY
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {GENRE_CARDS.map((card) => (
              <AnimatedPressable
                key={card.genre}
                onPress={() => handleGenrePress(card.genre)}
              >
                <View
                  style={{
                    width: 100,
                    height: 72,
                    borderRadius: 12,
                    backgroundColor: card.color,
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: DJCOLORS.border,
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{card.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'SpaceGrotesk-Bold',
                      color: '#fff',
                    }}
                  >
                    {card.genre}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'SpaceGrotesk-Regular',
                      color: DJCOLORS.textSecondary,
                    }}
                  >
                    {card.bpm}
                  </Text>
                </View>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        {/* Mix Upload */}
        <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            🎧 MIX UPLOAD
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {MIX_UPLOAD_FEATURES.map((feat) => (
              <AnimatedPressable
                key={feat.label}
                onPress={() => handleMixFeature(feat.label)}
                style={{ width: '47%' }}
              >
                <View
                  style={{
                    backgroundColor: DJCOLORS.surface,
                    borderRadius: 14,
                    padding: 14,
                    minHeight: 80,
                    borderWidth: 1,
                    borderColor: DJCOLORS.border,
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{feat.icon}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'SpaceGrotesk-Bold',
                      color: DJCOLORS.text,
                    }}
                  >
                    {feat.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'SpaceGrotesk-Regular',
                      color: DJCOLORS.textSecondary,
                    }}
                  >
                    {feat.sub}
                  </Text>
                </View>
              </AnimatedPressable>
            ))}
          </View>
        </View>

        {/* Haitian DJ Spotlight */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              letterSpacing: 1,
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            🇭🇹 HAITIAN DJ SPOTLIGHT
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {HAITIAN_DJS.map((dj) => (
              <AnimatedPressable
                key={dj.name}
                onPress={() => handleHaitianDJ(dj.name)}
              >
                <View
                  style={{
                    width: 150,
                    height: 100,
                    borderRadius: 14,
                    backgroundColor: dj.color,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: DJCOLORS.border,
                  }}
                >
                  {/* Rank badge top-left */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: DJCOLORS.gold,
                      borderRadius: 10,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'SpaceGrotesk-Bold',
                        color: '#0A0A0F',
                      }}
                    >
                      {dj.rank}
                    </Text>
                  </View>
                  {/* Flag top-right */}
                  <Text
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 10,
                      fontSize: 16,
                    }}
                  >
                    {dj.flag}
                  </Text>
                  {/* Name + genre bottom */}
                  <View style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'SpaceGrotesk-Bold',
                        color: '#fff',
                        marginBottom: 2,
                      }}
                      numberOfLines={1}
                    >
                      {dj.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'SpaceGrotesk-Regular',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                      numberOfLines={1}
                    >
                      {dj.genre}
                    </Text>
                  </View>
                </View>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        {/* DJ Battles */}
        <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            🏆 DJ BATTLES
          </Text>

          {/* Live battle */}
          <AnimatedPressable onPress={handleVoteNow} style={{ marginBottom: 10 }}>
            <View
              style={{
                backgroundColor: '#1A0505',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: DJCOLORS.danger,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View
                  style={{
                    backgroundColor: DJCOLORS.danger,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'SpaceGrotesk-Bold',
                      color: '#fff',
                      letterSpacing: 0.5,
                    }}
                  >
                    🔴 LIVE
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.text,
                  marginBottom: 4,
                }}
              >
                Haiti vs USA
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SpaceGrotesk-Regular',
                  color: DJCOLORS.textSecondary,
                  marginBottom: 14,
                }}
              >
                8,900 votes
              </Text>
              <View
                style={{
                  backgroundColor: DJCOLORS.danger,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'SpaceGrotesk-Bold',
                    color: '#fff',
                  }}
                >
                  VOTE NOW →
                </Text>
              </View>
            </View>
          </AnimatedPressable>

          {/* Upcoming */}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.textSecondary,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            UPCOMING
          </Text>
          {UPCOMING_BATTLES.map((battle) => (
            <AnimatedPressable
              key={battle.title}
              onPress={() => handleUpcomingBattle(battle.title)}
            >
              <View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Text style={{ fontSize: 20 }}>⚔️</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'SpaceGrotesk-Bold',
                      color: DJCOLORS.text,
                      marginBottom: 2,
                    }}
                  >
                    {battle.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'SpaceGrotesk-Regular',
                      color: DJCOLORS.textSecondary,
                    }}
                  >
                    {battle.participants}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'SpaceGrotesk-Medium',
                    color: DJCOLORS.textTertiary,
                  }}
                >
                  {battle.time}
                </Text>
              </View>
            </AnimatedPressable>
          ))}
        </View>

        {/* DJ Ranking */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            📈 DJ RANKING
          </Text>

          {/* Podium row */}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginBottom: 14,
            }}
          >
            {RANKING_TOP3.map((dj) => (
              <AnimatedPressable
                key={dj.name}
                onPress={() => handleRankingDJ(dj.name)}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: DJCOLORS.surface,
                    borderRadius: 14,
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: dj.color + '55',
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{dj.medal}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'SpaceGrotesk-Bold',
                      color: dj.color,
                      letterSpacing: 0.3,
                      textAlign: 'center',
                    }}
                    numberOfLines={2}
                  >
                    {dj.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'SpaceGrotesk-Medium',
                      color: DJCOLORS.textSecondary,
                    }}
                  >
                    {dj.followers}
                  </Text>
                </View>
              </AnimatedPressable>
            ))}
          </View>

          <AnimatedPressable onPress={handleSeeFullRanking}>
            <View
              style={{
                backgroundColor: DJCOLORS.surface,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.primary,
                }}
              >
                See Full Ranking →
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </View>
  );
}
