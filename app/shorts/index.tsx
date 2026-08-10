import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SHORTS_DATA = [
  {
    id: '1',
    dj: 'DJ JHONLYBEST 🇭🇹',
    title: 'AFROBEAT VIBES MIX',
    bpm: '108 BPM',
    tags: ['#Kompa', '#Afrobeat'],
    likes: '12.4K',
    comments: '512',
    bg: '#0D0A1F',
    emoji: '🎧',
  },
  {
    id: '2',
    dj: 'DJ KILLA NY 🇺🇸',
    title: 'NYC NIGHT SESSION',
    bpm: '128 BPM',
    tags: ['#HipHop', '#Trap'],
    likes: '8.9K',
    comments: '341',
    bg: '#0A0F1F',
    emoji: '🎵',
  },
  {
    id: '3',
    dj: 'DJ SPIN AFRICA 🇳🇬',
    title: 'AFROBEATS TAKEOVER',
    bpm: '112 BPM',
    tags: ['#Afrobeats', '#Amapiano'],
    likes: '21.3K',
    comments: '892',
    bg: '#0A1A0F',
    emoji: '🔥',
  },
  {
    id: '4',
    dj: 'DJ MAD VIBES 🇬🇧',
    title: 'UK GARAGE MIX',
    bpm: '130 BPM',
    tags: ['#UKGarage', '#Grime'],
    likes: '5.7K',
    comments: '213',
    bg: '#1A0A0F',
    emoji: '⚡',
  },
  {
    id: '5',
    dj: 'DJ KOMPAMIX 🇺🇸',
    title: 'KOMPA CLASSICS',
    bpm: '100 BPM',
    tags: ['#Kompa', '#Caribbean'],
    likes: '15.2K',
    comments: '634',
    bg: '#1A0F0A',
    emoji: '🌴',
  },
];

function ActionButton({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <AnimatedPressable onPress={onPress}>
      <View style={{ alignItems: 'center', gap: 4, marginBottom: 20 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </View>
        <Text
          style={{
            color: DJCOLORS.text,
            fontSize: 12,
            fontWeight: '600',
            fontFamily: 'SpaceGrotesk-Medium',
          }}
        >
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

function ShortItem({ item }: { item: typeof SHORTS_DATA[0] }) {
  const handleLike = () => console.log(`[Shorts] Like pressed on: ${item.dj} - ${item.title}`);
  const handleComment = () => console.log(`[Shorts] Comment pressed on: ${item.dj} - ${item.title}`);
  const handleShare = () => console.log(`[Shorts] Share pressed on: ${item.dj} - ${item.title}`);
  const handleBattle = () => console.log(`[Shorts] Battle pressed on: ${item.dj} - ${item.title}`);

  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: item.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Center emoji */}
      <Text style={{ fontSize: 120 }}>{item.emoji}</Text>

      {/* Bottom gradient overlay */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SCREEN_HEIGHT * 0.45,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Bottom left info */}
      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: 20,
          right: 80,
        }}
      >
        <Text
          style={{
            color: DJCOLORS.text,
            fontSize: 18,
            fontWeight: '800',
            fontFamily: 'SpaceGrotesk-Bold',
            marginBottom: 4,
          }}
        >
          {item.dj}
        </Text>
        <Text
          style={{
            color: DJCOLORS.textSecondary,
            fontSize: 13,
            fontFamily: 'SpaceGrotesk-Regular',
            marginBottom: 10,
          }}
        >
          {item.title}
          {' • '}
          {item.bpm}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {item.tags.map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  color: DJCOLORS.text,
                  fontSize: 12,
                  fontWeight: '600',
                  fontFamily: 'SpaceGrotesk-Medium',
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Right action buttons */}
      <View
        style={{
          position: 'absolute',
          right: 16,
          bottom: 120,
        }}
      >
        <ActionButton emoji="❤️" label={item.likes} onPress={handleLike} />
        <ActionButton emoji="💬" label={item.comments} onPress={handleComment} />
        <ActionButton emoji="↗️" label="Share" onPress={handleShare} />
        <ActionButton emoji="🏆" label="Battle" onPress={handleBattle} />
      </View>
    </View>
  );
}

export default function ShortsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleClose = () => {
    console.log('[Shorts] Close button pressed');
    router.back();
  };

  const handleSearch = () => {
    console.log('[Shorts] Search button pressed');
  };

  const handleTabPress = (index: number) => {
    const labels = ['For You', 'Following'];
    console.log(`[Shorts] Tab pressed: ${labels[index]}`);
    setActiveTab(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <FlatList
        data={SHORTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ShortItem item={item} />}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />

      {/* Top overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <AnimatedPressable onPress={handleClose}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} color={DJCOLORS.text} />
            </View>
          </AnimatedPressable>

          <Text
            style={{
              color: DJCOLORS.text,
              fontSize: 16,
              fontWeight: '800',
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: 1,
            }}
          >
            DJ SHORTS
          </Text>

          <AnimatedPressable onPress={handleSearch}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={20} color={DJCOLORS.text} />
            </View>
          </AnimatedPressable>
        </View>

        {/* Segmented tabs */}
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            gap: 24,
          }}
        >
          {['For You', 'Following'].map((tab, i) => (
            <AnimatedPressable key={tab} onPress={() => handleTabPress(i)}>
              <View style={{ alignItems: 'center', paddingVertical: 4 }}>
                <Text
                  style={{
                    color: activeTab === i ? DJCOLORS.text : 'rgba(255,255,255,0.5)',
                    fontWeight: activeTab === i ? '700' : '400',
                    fontSize: 15,
                    fontFamily: activeTab === i ? 'SpaceGrotesk-Bold' : 'SpaceGrotesk-Regular',
                  }}
                >
                  {tab}
                </Text>
                {activeTab === i && (
                  <View
                    style={{
                      height: 2,
                      width: '100%',
                      backgroundColor: DJCOLORS.text,
                      borderRadius: 1,
                      marginTop: 3,
                    }}
                  />
                )}
              </View>
            </AnimatedPressable>
          ))}
        </View>
      </View>
    </View>
  );
}
