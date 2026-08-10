import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Data ────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { id: '1', title: 'Love Tonight', meta: '106 BPM • 8A • 98%', iconBg: DJCOLORS.accentBlue, icon: '♪' },
  { id: '2', title: 'Party People', meta: '110 BPM • 9A • 94%', iconBg: '#FF6B35', icon: '🔥' },
  { id: '3', title: 'Feel The Bass', meta: '105 BPM • 7A • 91%', iconBg: DJCOLORS.gold, icon: '★' },
];

const STORIES = [
  { id: 'you', label: 'Your Story', color: '#7B4FFF', initials: '+', isOwn: true },
  { id: '1', label: 'DJ STORM', color: '#FF4F4F', initials: 'DS', isOwn: false },
  { id: '2', label: 'MARIE', color: '#FF4FC8', initials: 'MA', isOwn: false },
  { id: '3', label: 'DJ NOVA', color: '#4FC8FF', initials: 'DN', isOwn: false },
  { id: '4', label: 'KOMPA K', color: '#FFB800', initials: 'KK', isOwn: false },
  { id: '5', label: 'PARTY Q', color: '#34D399', initials: 'PQ', isOwn: false },
];

const LIVE_STREAMS = [
  { id: '1', name: 'DJ JHONLYBEST', viewers: '1.2K', color: '#1A0A3A' },
  { id: '2', name: 'DJ KOMPA KING', viewers: '856', color: '#0A1A3A' },
  { id: '3', name: 'DJ NOVA', viewers: '2.4K', color: '#2A0A1A' },
];

const TRENDING_POSTS = [
  { id: '1', username: 'DJ JHONLYBEST', caption: 'New Afrobeat set 🔥 BPM 128', likes: 2400, avatarColor: '#7B4FFF', contentColor: '#1A0A3A' },
  { id: '2', username: 'MARIE_CREATOR', caption: 'Party vibes last night 🎉', likes: 1100, avatarColor: '#FF4FC8', contentColor: '#0A1A3A' },
  { id: '3', username: 'DJ STORM', caption: 'Who wants to battle? 👊', likes: 3200, avatarColor: '#FF4F4F', contentColor: '#3A0A0A' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SuggestionCard({ item, index }: { item: typeof SUGGESTIONS[0]; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: 300 + index * 80, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay: 300 + index * 80, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, index]);

  const handlePlay = () => {
    console.log(`[Home] Play suggestion pressed: ${item.title}`);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 16,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: DJCOLORS.border,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: item.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          <Text style={{ fontSize: 22 }}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: DJCOLORS.text, fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 3 }}>
            {item.title}
          </Text>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
            {item.meta}
          </Text>
        </View>
        <AnimatedPressable onPress={handlePlay}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: DJCOLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Play size={16} color={DJCOLORS.text} fill={DJCOLORS.text} />
          </View>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

function StoryCircle({ story }: { story: typeof STORIES[0] }) {
  const handlePress = () => {
    console.log(`[Home] Story pressed: ${story.label}`);
  };

  return (
    <AnimatedPressable onPress={handlePress}>
      <View style={{ alignItems: 'center', marginRight: 14 }}>
        {/* Ring */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            borderWidth: 2,
            borderColor: story.color,
            padding: 3,
            marginBottom: 6,
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 32,
              backgroundColor: story.color + '33',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' }}>
              {story.initials}
            </Text>
          </View>
          {story.isOwn && (
            <View
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: DJCOLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: DJCOLORS.background,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 11, lineHeight: 14 }}>+</Text>
            </View>
          )}
        </View>
        <Text
          style={{
            color: DJCOLORS.textSecondary,
            fontSize: 10,
            fontFamily: 'SpaceGrotesk-Medium',
            maxWidth: 64,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {story.label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

function LiveCard({ stream }: { stream: typeof LIVE_STREAMS[0] }) {
  const handlePress = () => {
    console.log(`[Home] Live card pressed: ${stream.name} (${stream.viewers} viewers)`);
  };

  return (
    <AnimatedPressable onPress={handlePress}>
      <View style={{ marginRight: 12, width: 140 }}>
        <View
          style={{
            width: 140,
            height: 90,
            borderRadius: 12,
            backgroundColor: stream.color,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
            marginBottom: 6,
            overflow: 'hidden',
          }}
        >
          {/* LIVE badge */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#FF4F4F',
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 3,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' }} />
            <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'SpaceGrotesk-Bold' }}>LIVE</Text>
          </View>
          {/* Viewer count */}
          <View
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 8,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'SpaceGrotesk-Medium' }}>
              {stream.viewers}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: DJCOLORS.text,
            fontSize: 11,
            fontFamily: 'SpaceGrotesk-Bold',
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {stream.name}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

function TrendingPostRow({ post }: { post: typeof TRENDING_POSTS[0] }) {
  const likeDisplay = post.likes >= 1000 ? (post.likes / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(post.likes);

  const handlePress = () => {
    console.log(`[Home] Trending post pressed: ${post.username}`);
  };

  return (
    <AnimatedPressable onPress={handlePress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: DJCOLORS.surface,
          borderRadius: 14,
          padding: 12,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: DJCOLORS.border,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            backgroundColor: post.contentColor,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: DJCOLORS.border,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: post.avatarColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'SpaceGrotesk-Bold' }}>
              {post.username.slice(0, 2)}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: DJCOLORS.text, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 2 }}>
            {post.username}
          </Text>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Regular' }} numberOfLines={1}>
            {post.caption}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 14 }}>❤️</Text>
          <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
            {likeDisplay}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [activeWorld, setActiveWorld] = useState<'dj' | 'social'>('dj');

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.55,
      duration: 1200,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const handleWorldSwitch = (world: 'dj' | 'social') => {
    console.log(`[Home] World switched to: ${world === 'dj' ? 'DJ WORLD' : 'SOCIAL WORLD'}`);
    setActiveWorld(world);
  };

  const handleSuggestNext = () => {
    console.log('[Home] Button pressed: Suggest Next → navigating to AI Assistant');
    router.push('/ai-assistant' as any);
  };

  const handleStudio = () => {
    console.log('[Home] Button pressed: Studio → navigating to Studio tab');
    router.push('/(tabs)/(studio)');
  };

  const handleBattles = () => {
    console.log('[Home] Button pressed: DJ Battles → navigating to Battle tab');
    router.push('/(tabs)/(battle)');
  };

  const handleShorts = () => {
    console.log('[Home] Button pressed: Shorts → navigating to Shorts');
    router.push('/shorts' as any);
  };

  const handleBell = () => {
    console.log('[Home] Bell icon pressed');
  };

  const handleDM = () => {
    console.log('[Home] DM icon pressed');
  };

  const isDJ = activeWorld === 'dj';

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
        {/* ── Header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text, letterSpacing: -0.5 }}>
              DJ
            </Text>
            <Text style={{ fontSize: 28, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.primary, letterSpacing: -0.5 }}>
              VERSE
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <AnimatedPressable onPress={handleBell}>
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
                <Text style={{ fontSize: 18 }}>🔔</Text>
              </View>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleDM}>
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
                <Text style={{ fontSize: 18 }}>💬</Text>
              </View>
            </AnimatedPressable>
          </View>
        </View>

        {/* ── World Selector ── */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <AnimatedPressable onPress={() => handleWorldSwitch('dj')} style={{ flex: 1 }}>
            {isDJ ? (
              <LinearGradient
                colors={[DJCOLORS.primary, DJCOLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' }}>
                  🎧 DJ WORLD
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: DJCOLORS.surface,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                }}
              >
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 15, fontFamily: 'SpaceGrotesk-Medium' }}>
                  🎧 DJ WORLD
                </Text>
              </View>
            )}
          </AnimatedPressable>

          <AnimatedPressable onPress={() => handleWorldSwitch('social')} style={{ flex: 1 }}>
            {!isDJ ? (
              <LinearGradient
                colors={[DJCOLORS.primary, DJCOLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' }}>
                  🌎 SOCIAL WORLD
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: DJCOLORS.surface,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                }}
              >
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 15, fontFamily: 'SpaceGrotesk-Medium' }}>
                  🌎 SOCIAL WORLD
                </Text>
              </View>
            )}
          </AnimatedPressable>
        </View>

        {/* ══════════════════════════════════════════════
            DJ WORLD
        ══════════════════════════════════════════════ */}
        {isDJ && (
          <>
            {/* NOW PLAYING Card */}
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
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SpaceGrotesk-Medium',
                  color: DJCOLORS.textSecondary,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                NOW PLAYING
              </Text>
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.text,
                  letterSpacing: -0.3,
                  marginBottom: 4,
                }}
              >
                Body On Fire
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: DJCOLORS.textSecondary,
                  fontFamily: 'SpaceGrotesk-Regular',
                  marginBottom: 16,
                }}
              >
                Afrobeat • 108 BPM • 8A
              </Text>

              {/* Progress Bar */}
              <View
                style={{
                  height: 6,
                  backgroundColor: DJCOLORS.surfaceSecondary,
                  borderRadius: 3,
                  marginBottom: 20,
                  overflow: 'hidden',
                }}
              >
                <Animated.View
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    backgroundColor: DJCOLORS.accentBlue,
                  }}
                />
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <AnimatedPressable onPress={handleSuggestNext} style={{ flex: 1 }}>
                  <LinearGradient
                    colors={[DJCOLORS.primary, '#C84FFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>🤖</Text>
                    <Text style={{ color: DJCOLORS.text, fontFamily: 'SpaceGrotesk-Bold', fontSize: 15 }}>
                      Suggest Next
                    </Text>
                  </LinearGradient>
                </AnimatedPressable>

                <AnimatedPressable onPress={handleStudio} style={{ flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: DJCOLORS.surfaceSecondary,
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                      borderWidth: 1,
                      borderColor: DJCOLORS.border,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>🎛️</Text>
                    <Text style={{ color: DJCOLORS.text, fontFamily: 'SpaceGrotesk-Bold', fontSize: 15 }}>
                      Studio
                    </Text>
                  </View>
                </AnimatedPressable>
              </View>
            </View>

            {/* AI SUGGEST NEXT */}
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'SpaceGrotesk-Bold',
                color: DJCOLORS.text,
                letterSpacing: -0.3,
                marginBottom: 16,
              }}
            >
              AI SUGGEST NEXT
            </Text>
            {SUGGESTIONS.map((item, index) => (
              <SuggestionCard key={item.id} item={item} index={index} />
            ))}

            {/* Quick Actions */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <AnimatedPressable onPress={handleBattles} style={{ flex: 1 }}>
                <LinearGradient
                  colors={[DJCOLORS.primary, DJCOLORS.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>🏆</Text>
                  <Text style={{ color: DJCOLORS.text, fontFamily: 'SpaceGrotesk-Bold', fontSize: 15 }}>
                    DJ Battles
                  </Text>
                </LinearGradient>
              </AnimatedPressable>

              <AnimatedPressable onPress={handleShorts} style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: DJCOLORS.surface,
                    borderRadius: 16,
                    paddingVertical: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    borderWidth: 1,
                    borderColor: DJCOLORS.border,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>📱</Text>
                  <Text style={{ color: DJCOLORS.text, fontFamily: 'SpaceGrotesk-Bold', fontSize: 15 }}>
                    Shorts
                  </Text>
                </View>
              </AnimatedPressable>
            </View>
          </>
        )}

        {/* ══════════════════════════════════════════════
            SOCIAL WORLD
        ══════════════════════════════════════════════ */}
        {!isDJ && (
          <>
            {/* STORIES */}
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SpaceGrotesk-Medium',
                color: DJCOLORS.textSecondary,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              STORIES
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20, marginBottom: 28 }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {STORIES.map((story) => (
                <StoryCircle key={story.id} story={story} />
              ))}
            </ScrollView>

            {/* LIVE NOW */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4F4F', marginRight: 6 }} />
              <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text }}>
                LIVE NOW
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20, marginBottom: 28 }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {LIVE_STREAMS.map((stream) => (
                <LiveCard key={stream.id} stream={stream} />
              ))}
            </ScrollView>

            {/* TRENDING POSTS */}
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SpaceGrotesk-Bold',
                color: DJCOLORS.text,
                marginBottom: 14,
              }}
            >
              TRENDING 🌎
            </Text>
            {TRENDING_POSTS.map((post) => (
              <TrendingPostRow key={post.id} post={post} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
