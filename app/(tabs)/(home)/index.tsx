import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, MessageCircle, Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Data ────────────────────────────────────────────────────────────────────

const STORIES = [
  { id: 'you', label: 'Your Story', color: '#7B4FFF', initials: '🎧', isOwn: true },
  { id: '1', label: 'DJ STORM', color: '#FF4F4F', initials: 'DS', isLive: true },
  { id: '2', label: 'MARIE', color: '#FF4FC8', initials: 'MA' },
  { id: '3', label: 'DJ NOVA', color: '#4FC8FF', initials: 'DN', isLive: true },
  { id: '4', label: 'KOMPA K', color: '#FFB800', initials: 'KK' },
  { id: '5', label: 'PARTY Q', color: '#34D399', initials: 'PQ' },
  { id: '6', label: 'DJ BEATS', color: '#A04FFF', initials: 'DB' },
];

const FILTER_TABS = ['🔥 For You', '👥 Following', '🎧 DJs', '🌎 Trending'];

const TRENDING_ITEMS = [
  { icon: '🎧', text: 'DJ JHONLYBEST — LIVE', color: '#7B4FFF' },
  { icon: '🏆', text: 'Haiti vs USA Battle', color: '#FF4F4F' },
  { icon: '🎵', text: 'Kompa Fusion — 12.4K', color: '#FFB800' },
];

const FEED_POSTS = [
  { id: 'trending', type: 'banner' },
  { id: '1', type: 'post', username: 'DJ JHONLYBEST', userType: 'DJ', postType: 'Live', caption: '🔴 LIVE NOW — Afrobeat Set 🔥 Join 1.2K viewers', likes: 4200, comments: 312, timeAgo: 'LIVE', avatarColor: '#7B4FFF', contentColor: '#1A0A3A', isLive: true, sound: 'Body On Fire' },
  { id: '2', type: 'post', username: 'MARIE_CREATOR', userType: 'Creator', postType: 'Photo', caption: 'Party vibes last night 🎉 #DJBEST', likes: 1100, comments: 34, timeAgo: '2h ago', avatarColor: '#FF4FC8', contentColor: '#0A1A3A', isLive: false, sound: null },
  { id: '3', type: 'post', username: 'DJ STORM', userType: 'DJ', postType: 'Battle', caption: '🏆 Haiti vs USA — WHO WINS? Vote now!', likes: 8900, comments: 567, timeAgo: '3h ago', avatarColor: '#FF4F4F', contentColor: '#3A0A0A', isLive: false, sound: 'Midnight Energy' },
  { id: '4', type: 'post', username: 'FANATIC_BEATS', userType: 'Fan', postType: 'Video', caption: 'This transition is INSANE 😱 @DJSTORM', likes: 2300, comments: 89, timeAgo: '5h ago', avatarColor: '#4FC8FF', contentColor: '#0A2A1A', isLive: false, sound: 'Love Tonight' },
  { id: '5', type: 'post', username: 'DJ KOMPA KING', userType: 'DJ', postType: 'Short', caption: 'Kompa x Afrobeat fusion 🌴 #NewSound', likes: 12400, comments: 891, timeAgo: '6h ago', avatarColor: '#FFB800', contentColor: '#2A0A2A', isLive: true, sound: 'Kompa Fusion' },
  { id: '6', type: 'post', username: 'PARTY_QUEEN', userType: 'Creator', postType: 'Event', caption: '📍 DJ BEST PARTY — Port-au-Prince Dec 28 🇭🇹', likes: 3100, comments: 145, timeAgo: '8h ago', avatarColor: '#34D399', contentColor: '#1A2A0A', isLive: false, sound: null },
  { id: '7', type: 'post', username: 'DJ NOVA', userType: 'DJ', postType: 'Mix', caption: 'House music all night long 🏠 Full 1hr set', likes: 5600, comments: 234, timeAgo: '10h ago', avatarColor: '#A04FFF', contentColor: '#1A0A3A', isLive: false, sound: 'Nova House Mix' },
  { id: '8', type: 'post', username: 'MUSIC_LOVER', userType: 'Fan', postType: 'Photo', caption: 'Best night ever with @DJSTORM 🙌', likes: 890, comments: 45, timeAgo: '12h ago', avatarColor: '#FF8A4F', contentColor: '#0A1A3A', isLive: false, sound: null },
  { id: '9', type: 'post', username: 'DJ BEATS', userType: 'DJ', postType: 'Short', caption: 'New Amapiano drop 🎵 Who vibes with this?', likes: 7800, comments: 456, timeAgo: '1d ago', avatarColor: '#4FFF8A', contentColor: '#2A0A2A', isLive: false, sound: 'Amapiano Drop' },
];

const POST_TYPE_ICONS: Record<string, string> = {
  Live: '🔴',
  Photo: '📸',
  Battle: '🏆',
  Video: '🎥',
  Short: '📱',
  Event: '📍',
  Mix: '🎧',
};

const USER_TYPE_COLORS: Record<string, string> = {
  DJ: DJCOLORS.primary,
  Creator: DJCOLORS.accent,
  Fan: DJCOLORS.accentBlue,
};

// ─── Trending Banner ──────────────────────────────────────────────────────────

function TrendingBanner({ onSeeAll }: { onSeeAll: () => void }) {
  return (
    <LinearGradient
      colors={['#1A0A3A', '#0A0A1A']}
      style={{
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          color: DJCOLORS.gold,
          letterSpacing: 1.5,
          fontFamily: 'SpaceGrotesk-Bold',
          marginBottom: 12,
        }}
      >
        🔥 TRENDING NOW
      </Text>
      {TRENDING_ITEMS.map((item, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: i < TRENDING_ITEMS.length - 1 ? 8 : 0,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: item.color,
            }}
          />
          <Text
            style={{
              fontSize: 13,
              color: DJCOLORS.text,
              fontFamily: 'SpaceGrotesk-Medium',
              flex: 1,
            }}
          >
            {item.icon}
            {'  '}
            {item.text}
          </Text>
        </View>
      ))}
      <AnimatedPressable onPress={onSeeAll} style={{ alignSelf: 'flex-end', marginTop: 10 }}>
        <Text
          style={{
            fontSize: 12,
            color: DJCOLORS.primary,
            fontFamily: 'SpaceGrotesk-Medium',
          }}
        >
          See All Trending →
        </Text>
      </AnimatedPressable>
    </LinearGradient>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  type: string;
  username: string;
  userType: string;
  postType: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  avatarColor: string;
  contentColor: string;
  isLive: boolean;
  sound: string | null;
};

function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const likeCount = liked ? post.likes + 1 : post.likes;
  const likeCountDisplay = likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : String(likeCount);
  const badgeColor = USER_TYPE_COLORS[post.userType] ?? DJCOLORS.textSecondary;
  const postIcon = POST_TYPE_ICONS[post.postType] ?? '📄';
  const isBattle = post.postType === 'Battle';

  const handleLike = () => {
    console.log(`[Home] Like pressed on post by ${post.username}`);
    setLiked((v) => !v);
  };

  const handleComment = () => {
    console.log(`[Home] Comment pressed on post ${post.id} by ${post.username}`);
    router.push(`/social/${post.id}` as any);
  };

  const handleShare = () => {
    console.log(`[Home] Share pressed on post by ${post.username}`);
  };

  const handleSave = () => {
    console.log(`[Home] Save pressed on post by ${post.username}`);
    setSaved((v) => !v);
  };

  const handleMore = () => {
    console.log(`[Home] More menu opened for post by ${post.username}`);
    setMenuOpen((v) => !v);
  };

  const handleFollow = () => {
    console.log(`[Home] Follow toggled for ${post.username}`);
    setFollowing((v) => !v);
  };

  const handleUseSound = () => {
    console.log(`[Home] Use This Sound: ${post.sound}`);
    router.push('/(tabs)/(create)' as any);
  };

  const handleMenuAction = (action: string) => {
    console.log(`[Home] Post menu action: ${action} on post by ${post.username}`);
    setMenuOpen(false);
  };

  return (
    <View
      style={{
        backgroundColor: DJCOLORS.surface,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: DJCOLORS.border,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 10,
          gap: 10,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: post.avatarColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: '#fff' }}>
            {post.username.slice(0, 2)}
          </Text>
        </View>

        {/* Name + badge */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SpaceGrotesk-Bold',
                color: DJCOLORS.text,
              }}
            >
              {post.username}
            </Text>
            <View
              style={{
                backgroundColor: badgeColor + '22',
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderWidth: 1,
                borderColor: badgeColor + '55',
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: badgeColor,
                  letterSpacing: 0.5,
                }}
              >
                {post.userType}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 11,
              color: DJCOLORS.textSecondary,
              fontFamily: 'SpaceGrotesk-Regular',
            }}
          >
            {post.timeAgo}
          </Text>
        </View>

        {/* Follow button */}
        <AnimatedPressable onPress={handleFollow}>
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
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
              {following ? '✓' : '➕'}
            </Text>
          </View>
        </AnimatedPressable>
      </View>

      {/* Content area */}
      <View
        style={{
          marginHorizontal: 14,
          borderRadius: 12,
          overflow: 'hidden',
          aspectRatio: 16 / 9,
          backgroundColor: post.contentColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        {isBattle ? (
          <>
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '50%',
                backgroundColor: '#FF4F4F33',
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '50%',
                backgroundColor: '#4FC8FF33',
              }}
            />
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: DJCOLORS.border,
              }}
            >
              <Text style={{ fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text }}>
                VS
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ fontSize: 40 }}>{postIcon}</Text>
        )}

        {/* LIVE badge */}
        {post.isLive && (
          <>
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: '#FF4F4F',
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 4,
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
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'SpaceGrotesk-Medium',
                  color: '#fff',
                }}
              >
                1.2K 👁
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Sound bar */}
      {post.sound !== null && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            marginBottom: 8,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 14, color: DJCOLORS.primary }}>🎵</Text>
          <Text
            style={{
              fontSize: 13,
              color: DJCOLORS.primary,
              fontFamily: 'SpaceGrotesk-Medium',
              flex: 1,
            }}
            numberOfLines={1}
          >
            {post.sound}
          </Text>
          <AnimatedPressable onPress={handleUseSound}>
            <View
              style={{
                backgroundColor: DJCOLORS.primaryMuted,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SpaceGrotesk-Bold',
                  color: DJCOLORS.primary,
                  letterSpacing: 0.3,
                }}
              >
                USE THIS SOUND
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      )}

      {/* Caption */}
      <Text
        style={{
          fontSize: 14,
          color: DJCOLORS.text,
          fontFamily: 'SpaceGrotesk-Regular',
          paddingHorizontal: 14,
          marginBottom: 10,
          lineHeight: 20,
        }}
      >
        {post.caption}
      </Text>

      {/* Action row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingBottom: 14,
          gap: 4,
        }}
      >
        {/* Like */}
        <AnimatedPressable onPress={handleLike}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 4 }}>
            <Heart
              size={20}
              color={liked ? DJCOLORS.danger : DJCOLORS.textSecondary}
              fill={liked ? DJCOLORS.danger : 'transparent'}
            />
            <Text
              style={{
                fontSize: 13,
                color: liked ? DJCOLORS.danger : DJCOLORS.textSecondary,
                fontFamily: 'SpaceGrotesk-Medium',
              }}
            >
              {likeCountDisplay}
            </Text>
          </View>
        </AnimatedPressable>

        {/* Comment */}
        <AnimatedPressable onPress={handleComment}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 4 }}>
            <MessageSquare size={20} color={DJCOLORS.textSecondary} />
            <Text
              style={{
                fontSize: 13,
                color: DJCOLORS.textSecondary,
                fontFamily: 'SpaceGrotesk-Medium',
              }}
            >
              {post.comments}
            </Text>
          </View>
        </AnimatedPressable>

        {/* Share */}
        <AnimatedPressable onPress={handleShare}>
          <View style={{ paddingVertical: 6, paddingHorizontal: 4 }}>
            <Share2 size={20} color={DJCOLORS.textSecondary} />
          </View>
        </AnimatedPressable>

        <View style={{ flex: 1 }} />

        {/* Save */}
        <AnimatedPressable onPress={handleSave}>
          <View style={{ paddingVertical: 6, paddingHorizontal: 4 }}>
            <Bookmark
              size={20}
              color={saved ? DJCOLORS.primary : DJCOLORS.textSecondary}
              fill={saved ? DJCOLORS.primary : 'transparent'}
            />
          </View>
        </AnimatedPressable>

        {/* More */}
        <AnimatedPressable onPress={handleMore}>
          <View style={{ paddingVertical: 6, paddingHorizontal: 4 }}>
            <MoreHorizontal size={20} color={DJCOLORS.textSecondary} />
          </View>
        </AnimatedPressable>
      </View>

      {/* Inline mini-menu */}
      {menuOpen && (
        <View
          style={{
            marginHorizontal: 14,
            marginBottom: 14,
            backgroundColor: DJCOLORS.surfaceSecondary,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
            overflow: 'hidden',
          }}
        >
          {[
            { icon: '🚫', label: 'Report', color: DJCOLORS.danger },
            { icon: '🔕', label: 'Mute', color: DJCOLORS.textSecondary },
            { icon: '📌', label: 'Pin', color: DJCOLORS.textSecondary },
          ].map((item, i) => (
            <AnimatedPressable key={item.label} onPress={() => handleMenuAction(item.label)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: i < 2 ? 1 : 0,
                  borderBottomColor: DJCOLORS.divider,
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: item.color,
                    fontFamily: 'SpaceGrotesk-Medium',
                  }}
                >
                  {item.label}
                </Text>
              </View>
            </AnimatedPressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Story Circle ─────────────────────────────────────────────────────────────

type Story = {
  id: string;
  label: string;
  color: string;
  initials: string;
  isOwn?: boolean;
  isLive?: boolean;
};

function StoryCircle({ story, onPress }: { story: Story; onPress: () => void }) {
  const labelText = story.isLive ? 'LIVE' : story.label;
  const labelColor = story.isLive ? DJCOLORS.danger : DJCOLORS.textSecondary;

  return (
    <AnimatedPressable onPress={onPress}>
      <View style={{ alignItems: 'center', gap: 5 }}>
        {/* Outer ring */}
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 2.5,
            borderColor: story.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Gap */}
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
              backgroundColor: DJCOLORS.background,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: story.color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: story.isOwn ? 22 : 16, fontFamily: 'SpaceGrotesk-Bold', color: '#fff' }}>
                {story.initials}
              </Text>
            </View>
          </View>
        </View>

        {/* Add badge for own story */}
        {story.isOwn && (
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              right: 0,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: DJCOLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: DJCOLORS.background,
            }}
          >
            <Text style={{ fontSize: 11, color: '#fff', lineHeight: 14 }}>+</Text>
          </View>
        )}

        <Text
          style={{
            fontSize: 10,
            color: labelColor,
            fontFamily: story.isLive ? 'SpaceGrotesk-Bold' : 'SpaceGrotesk-Regular',
            maxWidth: 64,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {labelText}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(0);

  const handleStoryPress = useCallback((story: Story) => {
    console.log(`[Home] Story pressed: ${story.label}`);
    if (story.isLive) {
      router.push('/live' as any);
    } else {
      router.push('/stories' as any);
    }
  }, [router]);

  const handleFilterPress = (index: number) => {
    console.log(`[Home] Filter tab pressed: ${FILTER_TABS[index]}`);
    setActiveFilter(index);
  };

  const handleBell = () => {
    console.log('[Home] Bell / notifications pressed');
  };

  const handleDM = () => {
    console.log('[Home] DM button pressed — navigating to messages');
    router.push('/messages/index' as any);
  };

  const handleSeeAllTrending = () => {
    console.log('[Home] See All Trending pressed');
  };

  const ListHeader = (
    <View>
      {/* App header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          marginBottom: 16,
        }}
      >
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontSize: 26,
                fontFamily: 'SpaceGrotesk-Bold',
                color: '#fff',
              }}
            >
              DJ
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontFamily: 'SpaceGrotesk-Bold',
                color: DJCOLORS.primary,
              }}
            >
              {' '}BEST
            </Text>
          </View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SpaceGrotesk-Regular',
              color: DJCOLORS.textSecondary,
              marginTop: 2,
            }}
          >
            Mix. Vibe. Create. Inspire.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Bell */}
          <AnimatedPressable onPress={handleBell}>
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
              <Bell size={20} color={DJCOLORS.textSecondary} />
              {/* Red dot badge */}
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: DJCOLORS.danger,
                  borderWidth: 1.5,
                  borderColor: DJCOLORS.surface,
                }}
              />
            </View>
          </AnimatedPressable>

          {/* DM */}
          <AnimatedPressable onPress={handleDM}>
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
              <MessageCircle size={20} color={DJCOLORS.textSecondary} />
              {/* Unread badge */}
              <View
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  minWidth: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: DJCOLORS.danger,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                  borderWidth: 1.5,
                  borderColor: DJCOLORS.surface,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: '700',
                    color: '#FFFFFF',
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  3
                </Text>
              </View>
            </View>
          </AnimatedPressable>
        </View>
      </View>

      {/* Stories label */}
      <Text
        style={{
          fontSize: 11,
          color: DJCOLORS.textSecondary,
          letterSpacing: 1.5,
          fontFamily: 'SpaceGrotesk-Bold',
          paddingHorizontal: 20,
          marginBottom: 8,
        }}
      >
        STORIES
      </Text>

      {/* Stories row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        style={{ marginBottom: 16 }}
      >
        {STORIES.map((story) => (
          <StoryCircle
            key={story.id}
            story={story}
            onPress={() => handleStoryPress(story)}
          />
        ))}
      </ScrollView>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 20, marginBottom: 8 }}
        style={{ marginBottom: 12 }}
      >
        {FILTER_TABS.map((label, i) => (
          <AnimatedPressable key={label} onPress={() => handleFilterPress(i)}>
            <View style={{ paddingBottom: 8 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'SpaceGrotesk-Medium',
                  color: activeFilter === i ? DJCOLORS.primary : DJCOLORS.textSecondary,
                }}
              >
                {label}
              </Text>
              {activeFilter === i && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: DJCOLORS.primary,
                    borderRadius: 1,
                  }}
                />
              )}
            </View>
          </AnimatedPressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: { item: (typeof FEED_POSTS)[number] }) => {
    if (item.type === 'banner') {
      return <TrendingBanner onSeeAll={handleSeeAllTrending} />;
    }
    return <PostCard post={item as Post} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <FlatList
        data={FEED_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
