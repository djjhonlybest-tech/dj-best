import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Data ────────────────────────────────────────────────────────────────────

const CREATE_OPTIONS = [
  { id: '1', icon: '📸', label: 'Photo', sub: 'Share a moment', color: '#0A1A3A', route: null },
  { id: '2', icon: '🎥', label: 'Video', sub: 'Post a clip', color: '#0A2A1A', route: null },
  { id: '3', icon: '🎧', label: 'Mix', sub: 'Share your set', color: '#1A0A3A', route: '/(tabs)/(studio)' },
  { id: '4', icon: '📱', label: 'Short', sub: '15–60 sec clip', color: '#2A0A2A', route: '/shorts' },
  { id: '5', icon: '🏆', label: 'Battle', sub: 'Challenge a DJ', color: '#3A0A0A', route: '/(tabs)/(battle)' },
  { id: '6', icon: '🔴', label: 'Go Live', sub: 'Stream now', color: '#1A0505', route: '/live' },
];

const TRENDING_SOUNDS = [
  { name: 'Body On Fire', artist: 'DJ JhonlyBest', uses: '24.5K videos', color: '#1A0A3A' },
  { name: 'Kompa Fusion', artist: 'DJ Kompa King', uses: '18.2K videos', color: '#2A0A2A' },
  { name: 'Midnight Energy', artist: 'DJ Nova', uses: '15.8K videos', color: '#0A1A3A' },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [soundQuery, setSoundQuery] = useState('');

  const handleCreateOption = (option: (typeof CREATE_OPTIONS)[number]) => {
    console.log(`[Create] Option pressed: ${option.label}`);
    if (option.route) {
      router.push(option.route as any);
    }
  };

  const handleSoundSearch = (text: string) => {
    console.log(`[Create] Sound search query: "${text}"`);
    setSoundQuery(text);
  };

  const handleUseSound = (name: string) => {
    console.log(`[Create] Use sound pressed: ${name}`);
  };

  const handleSoundPress = (name: string) => {
    console.log(`[Create] Sound row pressed: ${name}`);
  };

  // Build rows of 2 for the grid
  const rows: (typeof CREATE_OPTIONS)[] = [];
  for (let i = 0; i < CREATE_OPTIONS.length; i += 2) {
    rows.push(CREATE_OPTIONS.slice(i, i + 2));
  }

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
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.text,
              marginBottom: 4,
            }}
          >
            CREATE
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'SpaceGrotesk-Regular',
              color: DJCOLORS.textSecondary,
            }}
          >
            What do you want to share?
          </Text>
        </View>

        {/* Create options grid */}
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 28 }}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row', gap: 10 }}>
              {row.map((option) => (
                <AnimatedPressable
                  key={option.id}
                  onPress={() => handleCreateOption(option)}
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      backgroundColor: option.color,
                      borderRadius: 16,
                      padding: 20,
                      minHeight: 110,
                      borderWidth: 1,
                      borderColor: option.color + '66',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Text style={{ fontSize: 36, marginBottom: 8 }}>{option.icon}</Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'SpaceGrotesk-Bold',
                        color: '#fff',
                        marginBottom: 2,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'SpaceGrotesk-Regular',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {option.sub}
                    </Text>
                  </View>
                </AnimatedPressable>
              ))}
            </View>
          ))}
        </View>

        {/* Use This Sound section */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SpaceGrotesk-Bold',
              color: DJCOLORS.textSecondary,
              letterSpacing: 1.5,
              marginBottom: 12,
            }}
          >
            ADD A SOUND TO YOUR POST
          </Text>

          {/* Sound search bar */}
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
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 16 }}>🎵</Text>
            <TextInput
              value={soundQuery}
              onChangeText={handleSoundSearch}
              placeholder="Search sounds..."
              placeholderTextColor={DJCOLORS.textTertiary}
              style={{
                flex: 1,
                fontSize: 14,
                color: DJCOLORS.text,
                fontFamily: 'SpaceGrotesk-Regular',
              }}
            />
          </View>

          {/* Trending sound rows */}
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              overflow: 'hidden',
            }}
          >
            {TRENDING_SOUNDS.map((sound, i) => (
              <AnimatedPressable
                key={sound.name}
                onPress={() => handleSoundPress(sound.name)}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    gap: 12,
                    borderBottomWidth: i < TRENDING_SOUNDS.length - 1 ? 1 : 0,
                    borderBottomColor: DJCOLORS.divider,
                  }}
                >
                  {/* Colored square */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      backgroundColor: sound.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>🎵</Text>
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
                      {sound.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'SpaceGrotesk-Regular',
                        color: DJCOLORS.textSecondary,
                        marginBottom: 2,
                      }}
                    >
                      {sound.artist}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: 'SpaceGrotesk-Medium',
                        color: DJCOLORS.primary,
                      }}
                    >
                      {sound.uses}
                    </Text>
                  </View>

                  {/* Use button */}
                  <AnimatedPressable onPress={() => handleUseSound(sound.name)}>
                    <View
                      style={{
                        backgroundColor: DJCOLORS.primaryMuted,
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderWidth: 1,
                        borderColor: DJCOLORS.primary,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'SpaceGrotesk-Bold',
                          color: DJCOLORS.primary,
                        }}
                      >
                        USE
                      </Text>
                    </View>
                  </AnimatedPressable>
                </View>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
