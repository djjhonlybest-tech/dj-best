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
import { Search } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const UPCOMING_BATTLES = [
  {
    id: '1',
    dj1: 'DJ SPIN AFRICA 🇳🇬',
    dj2: 'DJ MAD VIBES 🇬🇧',
    genre: 'Afrobeats',
    time: 'Tonight 9PM',
  },
  {
    id: '2',
    dj1: 'DJ KOMPAMIX 🇺🇸',
    dj2: 'DJ JHONLYBEST 🇭🇹',
    genre: 'Kompa',
    time: 'Tomorrow 8PM',
  },
  {
    id: '3',
    dj1: 'DJ KILLA NY 🇺🇸',
    dj2: 'DJ SPIN AFRICA 🇳🇬',
    genre: 'Amapiano',
    time: 'Sat 10PM',
  },
];

function MiniWaveform({ color }: { color: string }) {
  const bars = [8, 14, 10, 18, 12, 16, 8, 14, 10, 18, 12, 16, 8, 14, 10, 18, 12, 16, 8, 14];
  const anims = useRef(bars.map(() => new Animated.Value(0.5))).current;

  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + i * 40,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300 + i * 40,
            useNativeDriver: true,
          }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [anims]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 20, gap: 2 }}>
      {bars.map((h, i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: h,
            borderRadius: 2,
            backgroundColor: color,
            transform: [{ scaleY: anims[i] }],
          }}
        />
      ))}
    </View>
  );
}

export default function BattleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [voted, setVoted] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (dj: string) => {
    console.log(`[Battle] Vote pressed for: ${dj}`);
    setVoted(dj);
  };

  const handleStartBattle = () => {
    console.log('[Battle] Start a Battle button pressed');
  };

  const handleSearch = () => {
    console.log('[Battle] Search button pressed');
  };

  const handleRemind = (battle: typeof UPCOMING_BATTLES[0]) => {
    console.log(`[Battle] Remind Me pressed for: ${battle.dj1} vs ${battle.dj2}`);
  };

  const timeStr = String(timeLeft).padStart(2, '0');

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
          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: -0.3,
            }}
          >
            DJ BATTLE
          </Text>
          <AnimatedPressable onPress={handleSearch}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
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

        {/* Active Battle Card */}
        <View
          style={{
            backgroundColor: DJCOLORS.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: 'rgba(123,79,255,0.3)',
          }}
        >
          {/* Round + Live */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: DJCOLORS.textSecondary,
                fontFamily: 'SpaceGrotesk-Bold',
                letterSpacing: 1,
              }}
            >
              ROUND 1
            </Text>
            <View
              style={{
                backgroundColor: DJCOLORS.danger,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 4,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: DJCOLORS.text,
                }}
              />
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontSize: 12,
                  fontWeight: '700',
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                LIVE
              </Text>
            </View>
          </View>

          {/* DJ Avatars */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginBottom: 20,
            }}
          >
            <View style={{ alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: DJCOLORS.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: DJCOLORS.primary,
                }}
              >
                <Text style={{ fontSize: 28 }}>🇭🇹</Text>
              </View>
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontWeight: '700',
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Bold',
                  textAlign: 'center',
                }}
              >
                DJ JHONLYBEST
              </Text>
              <MiniWaveform color={DJCOLORS.primary} />
              <Text
                style={{
                  color: DJCOLORS.textSecondary,
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Regular',
                }}
              >
                00:45
              </Text>
            </View>

            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: DJCOLORS.surfaceSecondary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontWeight: '800',
                  fontSize: 14,
                  fontFamily: 'SpaceGrotesk-Bold',
                }}
              >
                VS
              </Text>
            </View>

            <View style={{ alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: DJCOLORS.accentBlue,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: DJCOLORS.accentBlue,
                }}
              >
                <Text style={{ fontSize: 28 }}>🇺🇸</Text>
              </View>
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontWeight: '700',
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Bold',
                  textAlign: 'center',
                }}
              >
                DJ KILLA NY
              </Text>
              <MiniWaveform color={DJCOLORS.accentBlue} />
              <Text
                style={{
                  color: DJCOLORS.textSecondary,
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Regular',
                }}
              >
                00:45
              </Text>
            </View>
          </View>

          {/* Vote Section */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: DJCOLORS.textSecondary,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontFamily: 'SpaceGrotesk-Bold',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            VOTE FOR THE BEST MIX
          </Text>

          {/* DJ 1 Vote */}
          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.primary,
                  fontWeight: '600',
                  fontSize: 13,
                  fontFamily: 'SpaceGrotesk-Medium',
                }}
              >
                DJ JHONLYBEST
              </Text>
              <Text
                style={{
                  color: DJCOLORS.textSecondary,
                  fontSize: 13,
                  fontFamily: 'SpaceGrotesk-Regular',
                }}
              >
                62%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: DJCOLORS.surfaceSecondary,
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: '62%',
                  backgroundColor: DJCOLORS.primary,
                  borderRadius: 4,
                }}
              />
            </View>
            <AnimatedPressable onPress={() => handleVote('jhonlybest')}>
              <View
                style={{
                  backgroundColor: voted === 'jhonlybest' ? DJCOLORS.primary : DJCOLORS.primaryMuted,
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: DJCOLORS.primary,
                }}
              >
                <Text
                  style={{
                    color: DJCOLORS.text,
                    fontWeight: '700',
                    fontSize: 13,
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  {voted === 'jhonlybest' ? '✓ Voted' : 'Vote'}
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* DJ 2 Vote */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.accentBlue,
                  fontWeight: '600',
                  fontSize: 13,
                  fontFamily: 'SpaceGrotesk-Medium',
                }}
              >
                DJ KILLA NY
              </Text>
              <Text
                style={{
                  color: DJCOLORS.textSecondary,
                  fontSize: 13,
                  fontFamily: 'SpaceGrotesk-Regular',
                }}
              >
                38%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: DJCOLORS.surfaceSecondary,
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: '38%',
                  backgroundColor: DJCOLORS.accentBlue,
                  borderRadius: 4,
                }}
              />
            </View>
            <AnimatedPressable onPress={() => handleVote('killany')}>
              <View
                style={{
                  backgroundColor: voted === 'killany' ? DJCOLORS.accentBlue : 'rgba(79,200,255,0.1)',
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: DJCOLORS.accentBlue,
                }}
              >
                <Text
                  style={{
                    color: DJCOLORS.text,
                    fontWeight: '700',
                    fontSize: 13,
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  {voted === 'killany' ? '✓ Voted' : 'Vote'}
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Timer */}
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                color: DJCOLORS.textSecondary,
                fontSize: 13,
                fontFamily: 'SpaceGrotesk-Regular',
              }}
            >
              Time Left:
            </Text>
            <Text
              style={{
                color: timeLeft <= 5 ? DJCOLORS.danger : DJCOLORS.text,
                fontSize: 28,
                fontWeight: '800',
                fontFamily: 'SpaceGrotesk-Bold',
                fontVariant: ['tabular-nums'],
              }}
            >
              00:{timeStr}
            </Text>
          </View>
        </View>

        {/* Upcoming Battles */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: DJCOLORS.text,
            fontFamily: 'SpaceGrotesk-Bold',
            marginBottom: 16,
          }}
        >
          Upcoming Battles
        </Text>

        {UPCOMING_BATTLES.map((battle) => (
          <View
            key={battle.id}
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: DJCOLORS.text,
                    fontWeight: '700',
                    fontSize: 14,
                    fontFamily: 'SpaceGrotesk-Bold',
                    marginBottom: 2,
                  }}
                >
                  {battle.dj1}
                </Text>
                <Text
                  style={{
                    color: DJCOLORS.textSecondary,
                    fontSize: 12,
                    fontFamily: 'SpaceGrotesk-Regular',
                  }}
                >
                  vs {battle.dj2}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: DJCOLORS.primaryMuted,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: DJCOLORS.primary,
                    fontSize: 11,
                    fontWeight: '600',
                    fontFamily: 'SpaceGrotesk-Medium',
                  }}
                >
                  UPCOMING
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View
                  style={{
                    backgroundColor: DJCOLORS.surfaceSecondary,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      color: DJCOLORS.textSecondary,
                      fontSize: 11,
                      fontFamily: 'SpaceGrotesk-Regular',
                    }}
                  >
                    {battle.genre}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: DJCOLORS.surfaceSecondary,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      color: DJCOLORS.textSecondary,
                      fontSize: 11,
                      fontFamily: 'SpaceGrotesk-Regular',
                    }}
                  >
                    {battle.time}
                  </Text>
                </View>
              </View>
              <AnimatedPressable onPress={() => handleRemind(battle)}>
                <View
                  style={{
                    backgroundColor: DJCOLORS.primaryMuted,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: DJCOLORS.primary,
                  }}
                >
                  <Text
                    style={{
                      color: DJCOLORS.primary,
                      fontSize: 12,
                      fontWeight: '600',
                      fontFamily: 'SpaceGrotesk-Medium',
                    }}
                  >
                    Remind Me
                  </Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>
        ))}

        {/* Start Battle Button */}
        <AnimatedPressable
          onPress={handleStartBattle}
          style={{ marginTop: 8 }}
        >
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
              🏆 START A BATTLE
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}
