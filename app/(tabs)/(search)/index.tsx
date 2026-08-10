import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Data ────────────────────────────────────────────────────────────────────

const TRENDING_SOUNDS = [
  { name: 'Body On Fire', uses: '24.5K', color: '#1A0A3A' },
  { name: 'Kompa Fusion', uses: '18.2K', color: '#2A0A2A' },
  { name: 'Midnight Energy', uses: '15.8K', color: '#0A1A3A' },
  { name: 'Love Tonight', uses: '12.1K', color: '#1A2A0A' },
  { name: 'Amapiano Drop', uses: '9.7K', color: '#3A0A0A' },
];

const TOP_DJS = [
  { name: 'DJ JHONLYBEST', genre: 'Afrobeat • Kompa', followers: '15.6K', color: '#7B4FFF' },
  { name: 'DJ STORM', genre: 'Hip-Hop • Trap', followers: '23.1K', color: '#FF4F4F' },
  { name: 'DJ KOMPA KING', genre: 'Kompa • Caribbean', followers: '31.4K', color: '#FFB800' },
  { name: 'DJ NOVA', genre: 'House • Electronic', followers: '18.9K', color: '#4FC8FF' },
  { name: 'DJ BEATS', genre: 'Amapiano • Afro', followers: '12.3K', color: '#34D399' },
];

const HASHTAGS = [
  '#DJVERSE', '#Afrobeat', '#Kompa', '#Amapiano',
  '#DJBattle', '#HaitiVibes', '#Dancehall', '#HouseMusic',
];

// ─── DJ Row ───────────────────────────────────────────────────────────────────

type DJ = { name: string; genre: string; followers: string; color: string };

function DJRow({ dj }: { dj: DJ }) {
  const [following, setFollowing] = useState(false);

  const handleFollow = () => {
    console.log(`[Search] Follow toggled for ${dj.name}`);
    setFollowing((v) => !v);
  };

  const handlePress = () => {
    console.log(`[Search] DJ card pressed: ${dj.name}`);
  };

  return (
    <AnimatedPressable onPress={handlePress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: DJCOLORS.divider,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: dj.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: '#fff' }}>
            {dj.name.slice(0, 2)}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              marginBottom: 2,
            }}
          >
            {dj.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SpaceGrotesk-Regular',
                color: DJCOLORS.textSecondary,
              }}
            >
              {dj.genre}
            </Text>
            <Text style={{ fontSize: 12, color: DJCOLORS.textTertiary }}>•</Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SpaceGrotesk-Medium',
                color: DJCOLORS.textSecondary,
              }}
            >
              {dj.followers}
            </Text>
          </View>
        </View>

        {/* Follow */}
        <AnimatedPressable onPress={handleFollow}>
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: following ? DJCOLORS.surface : DJCOLORS.primaryMuted,
              borderWidth: 1,
              borderColor: following ? DJCOLORS.border : DJCOLORS.primary,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SpaceGrotesk-Bold',
                color: following ? DJCOLORS.textSecondary : DJCOLORS.primary,
              }}
            >
              {following ? 'Following' : 'Follow'}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </AnimatedPressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filteredDJs = query.trim()
    ? TOP_DJS.filter((dj) =>
        dj.name.toLowerCase().includes(query.toLowerCase())
      )
    : TOP_DJS;

  const handleSearchChange = (text: string) => {
    console.log(`[Search] Search query changed: "${text}"`);
    setQuery(text);
  };

  const handleSoundPress = (name: string) => {
    console.log(`[Search] Trending sound pressed: ${name}`);
  };

  const handleHashtagPress = (tag: string) => {
    console.log(`[Search] Hashtag pressed: ${tag}`);
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
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              marginBottom: 14,
            }}
          >
            DISCOVER
          </Text>

          {/* Search bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: DJCOLORS.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              height: 46,
              paddingHorizontal: 14,
              gap: 10,
            }}
          >
            <Search size={18} color={DJCOLORS.textSecondary} />
            <TextInput
              value={query}
              onChangeText={handleSearchChange}
              placeholder="Search DJs, sounds, hashtags..."
              placeholderTextColor={DJCOLORS.textTertiary}
              style={{
                flex: 1,
                fontSize: 14,
                color: DJCOLORS.text,
                fontFamily: 'SpaceGrotesk-Regular',
              }}
            />
          </View>
        </View>

        {query.trim() === '' ? (
          <>
            {/* Trending Sounds */}
            <View style={{ marginBottom: 24 }}>
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
                🎵 TRENDING SOUNDS
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              >
                {TRENDING_SOUNDS.map((sound) => (
                  <AnimatedPressable
                    key={sound.name}
                    onPress={() => handleSoundPress(sound.name)}
                  >
                    <View
                      style={{
                        width: 120,
                        height: 80,
                        borderRadius: 12,
                        backgroundColor: sound.color,
                        padding: 10,
                        justifyContent: 'flex-end',
                        borderWidth: 1,
                        borderColor: DJCOLORS.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'SpaceGrotesk-Bold',
                          color: '#fff',
                          marginBottom: 2,
                        }}
                        numberOfLines={1}
                      >
                        {sound.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'SpaceGrotesk-Regular',
                          color: DJCOLORS.textSecondary,
                        }}
                      >
                        🎵 {sound.uses} uses
                      </Text>
                    </View>
                  </AnimatedPressable>
                ))}
              </ScrollView>
            </View>

            {/* Top DJs */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.text,
                  letterSpacing: 1,
                  paddingHorizontal: 20,
                  marginBottom: 4,
                }}
              >
                🎧 TOP DJs
              </Text>
              <View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 16,
                  marginHorizontal: 20,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                  overflow: 'hidden',
                }}
              >
                {TOP_DJS.map((dj) => (
                  <DJRow key={dj.name} dj={dj} />
                ))}
              </View>
            </View>

            {/* Trending Hashtags */}
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
                # TRENDING
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {HASHTAGS.map((tag) => (
                  <AnimatedPressable key={tag} onPress={() => handleHashtagPress(tag)}>
                    <View
                      style={{
                        backgroundColor: DJCOLORS.surface,
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderWidth: 1,
                        borderColor: DJCOLORS.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'SpaceGrotesk-Medium',
                          color: DJCOLORS.textSecondary,
                        }}
                      >
                        {tag}
                      </Text>
                    </View>
                  </AnimatedPressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* Search results */
          <View>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SpaceGrotesk-Bold',
                color: DJCOLORS.text,
                letterSpacing: 1,
                paddingHorizontal: 20,
                marginBottom: 4,
              }}
            >
              🎧 DJs
            </Text>
            {filteredDJs.length > 0 ? (
              <View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 16,
                  marginHorizontal: 20,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                  overflow: 'hidden',
                }}
              >
                {filteredDJs.map((dj) => (
                  <DJRow key={dj.name} dj={dj} />
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 32, marginBottom: 12 }}>🔍</Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'SpaceGrotesk-Bold',
                    color: DJCOLORS.textSecondary,
                  }}
                >
                  No results for "{query}"
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
