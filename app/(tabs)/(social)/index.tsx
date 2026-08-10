import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, MessageCircle } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { label: 'For You', icon: '🔥' },
  { label: 'Following', icon: '👥' },
  { label: 'DJs', icon: '🎧' },
  { label: 'Trending', icon: '🌎' },
];

// ─── Stories data ─────────────────────────────────────────────────────────────

const STORIES = [
  { id: 'you', label: 'Your Story', color: '#7B4FFF', initials: '+', isOwn: true },
  { id: '1', label: 'DJ STORM', color: '#FF4F4F', initials: 'DS', isOwn: false },
  { id: '2', label: 'MARIE', color: '#FF4FC8', initials: 'MA', isOwn: false },
  { id: '3', label: 'DJ NOVA', color: '#4FC8FF', initials: 'DN', isOwn: false },
  { id: '4', label: 'KOMPA K', color: '#FFB800', initials: 'KK', isOwn: false },
  { id: '5', label: 'PARTY Q', color: '#34D399', initials: 'PQ', isOwn: false },
];

// ─── Post types ───────────────────────────────────────────────────────────────

type PostType = 'Mix' | 'Photo' | 'Battle' | 'Video' | 'Short' | 'Event';
type UserType = 'DJ' | 'Creator' | 'Fan';

interface Post {
  id: string;
  username: string;
  userType: UserType;
  postType: PostType;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  avatarColor: string;
  contentColor: string;
  isLive: boolean;
}

const POSTS: Post[] = [
  {
    id: '1',
    username: 'DJ JHONLYBEST',
    userType: 'DJ',
    postType: 'Mix',
    caption: 'New Afrobeat set 🔥 BPM 128',
    likes: 2400,
    comments: 89,
    timeAgo: '2h ago',
    avatarColor: '#7B4FFF',
    contentColor: '#1A0A3A',
    isLive: true,
  },
  {
    id: '2',
    username: 'MARIE_CREATOR',
    userType: 'Creator',
    postType: 'Photo',
    caption: 'Party vibes last night 🎉',
    likes: 1100,
    comments: 34,
    timeAgo: '4h ago',
    avatarColor: '#FF4FC8',
    contentColor: '#0A1A3A',
    isLive: false,
  },
  {
    id: '3',
    username: 'DJ STORM',
    userType: 'DJ',
    postType: 'Battle',
    caption: 'Who wants to battle? 👊',
    likes: 3200,
    comments: 156,
    timeAgo: '5h ago',
    avatarColor: '#FF4F4F',
    contentColor: '#3A0A0A',
    isLive: false,
  },
  {
    id: '4',
    username: 'FANATIC_BEATS',
    userType: 'Fan',
    postType: 'Video',
    caption: 'This transition is insane 😱',
    likes: 892,
    comments: 67,
    timeAgo: '7h ago',
    avatarColor: '#4FC8FF',
    contentColor: '#0A2A1A',
    isLive: false,
  },
  {
    id: '5',
    username: 'DJ KOMPA KING',
    userType: 'DJ',
    postType: 'Short',
    caption: 'Kompa x Afrobeat fusion 🌴',
    likes: 5600,
    comments: 234,
    timeAgo: '9h ago',
    avatarColor: '#FFB84F',
    contentColor: '#2A0A2A',
    isLive: true,
  },
  {
    id: '6',
    username: 'PARTY_QUEEN',
    userType: 'Creator',
    postType: 'Event',
    caption: 'DJVERSE PARTY — Port-au-Prince 📍 Dec 28',
    likes: 2100,
    comments: 98,
    timeAgo: '12h ago',
    avatarColor: '#4FFF8A',
    contentColor: '#1A2A0A',
    isLive: false,
  },
  {
    id: '7',
    username: 'DJ NOVA',
    userType: 'DJ',
    postType: 'Mix',
    caption: 'House music all night long 🏠',
    likes: 1800,
    comments: 45,
    timeAgo: '1d ago',
    avatarColor: '#A04FFF',
    contentColor: '#1A0A3A',
    isLive: false,
  },
  {
    id: '8',
    username: 'MUSIC_LOVER',
    userType: 'Fan',
    postType: 'Photo',
    caption: 'Best night ever with @DJSTORM',
    likes: 445,
    comments: 22,
    timeAgo: '1d ago',
    avatarColor: '#FF8A4F',
    contentColor: '#0A1A3A',
    isLive: false,
  },
];

const USER_TYPE_BADGE: Record<UserType, string> = {
  DJ: '🎧 DJ',
  Creator: '📱 Creator',
  Fan: '❤️ Fan',
};

const POST_TYPE_BADGE: Record<PostType, string> = {
  Mix: '🎧 Mix',
  Photo: '📸 Photo',
  Battle: '🏆 Battle',
  Video: '🎥 Video',
  Short: '🎵 Short',
  Event: '📍 Event',
};

const POST_TYPE_ICON: Record<PostType, string> = {
  Mix: '🎧',
  Photo: '📸',
  Battle: '🏆',
  Video: '🎥',
  Short: '🎵',
  Event: '📍',
};

function formatCount(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(n);
}

// ─── Story Circle ─────────────────────────────────────────────────────────────

function StoryCircle({ story }: { story: typeof STORIES[0] }) {
  const handlePress = () => {
    console.log(`[Social] Story pressed: ${story.label}`);
  };

  return (
    <AnimatedPressable onPress={handlePress}>
      <View style={{ alignItems: 'center', marginRight: 12 }}>
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            borderWidth: 2,
            borderColor: story.color,
            padding: 3,
            marginBottom: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 30,
              backgroundColor: story.color + '33',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' }}>
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
            maxWidth: 60,
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

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showMore, setShowMore] = useState(false);

  const userTypeBadge = USER_TYPE_BADGE[post.userType];
  const postTypeBadge = POST_TYPE_BADGE[post.postType];
  const postTypeIcon = POST_TYPE_ICON[post.postType];
  const likeDisplay = formatCount(likeCount);
  const commentDisplay = formatCount(post.comments);
  const likeEmoji = liked ? '❤️' : '🤍';
  const likeColor = liked ? '#FF4F4F' : DJCOLORS.textSecondary;
  const savedEmoji = saved ? '🔖' : '🔖';

  const handleLike = () => {
    console.log(`[Social] Like pressed on post ${post.id} (${post.username})`);
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked((v) => !v);
  };

  const handleComment = () => {
    console.log(`[Social] Comment pressed on post ${post.id} → navigating to detail`);
    router.push(`/social/${post.id}` as any);
  };

  const handleShare = () => {
    console.log(`[Social] Share pressed on post ${post.id}`);
  };

  const handleSave = () => {
    console.log(`[Social] Save pressed on post ${post.id}`);
    setSaved((v) => !v);
  };

  const handleMore = () => {
    console.log(`[Social] More menu toggled on post ${post.id}`);
    setShowMore((v) => !v);
  };

  const handleReport = () => {
    console.log(`[Social] Report pressed on post ${post.id}`);
    setShowMore(false);
  };

  const handleMute = () => {
    console.log(`[Social] Mute pressed for user ${post.username}`);
    setShowMore(false);
  };

  const handleFollow = () => {
    console.log(`[Social] Follow pressed for user ${post.username}`);
  };

  const handleCardPress = () => {
    console.log(`[Social] Card pressed for post ${post.id} → navigating to detail`);
    router.push(`/social/${post.id}` as any);
  };

  return (
    <AnimatedPressable onPress={handleCardPress}>
      <View
        style={{
          backgroundColor: DJCOLORS.surface,
          borderRadius: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: DJCOLORS.border,
          overflow: 'hidden',
        }}
      >
        {/* Post type badge top-right */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            backgroundColor: 'rgba(10,10,15,0.75)',
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
          }}
        >
          <Text style={{ color: DJCOLORS.text, fontSize: 11, fontFamily: 'SpaceGrotesk-Medium' }}>
            {postTypeBadge}
          </Text>
        </View>

        {/* Header row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingTop: 14,
            paddingBottom: 12,
            gap: 10,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: post.avatarColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
              {post.username.slice(0, 2)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: DJCOLORS.text,
                fontSize: 14,
                fontFamily: 'SpaceGrotesk-Bold',
                marginBottom: 2,
              }}
              numberOfLines={1}
            >
              {post.username}
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(123,79,255,0.15)',
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 2,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ color: DJCOLORS.primary, fontSize: 10, fontFamily: 'SpaceGrotesk-Medium' }}>
                {userTypeBadge}
              </Text>
            </View>
          </View>

          <AnimatedPressable onPress={handleFollow}>
            <View
              style={{
                backgroundColor: DJCOLORS.primaryMuted,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: DJCOLORS.primary,
              }}
            >
              <Text style={{ color: DJCOLORS.primary, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
                ➕ Follow
              </Text>
            </View>
          </AnimatedPressable>
        </View>

        {/* Content placeholder 16:9 */}
        <View
          style={{
            marginHorizontal: 14,
            borderRadius: 12,
            backgroundColor: post.contentColor,
            aspectRatio: 16 / 9,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
            overflow: 'hidden',
          }}
        >
          <Text style={{ fontSize: 40 }}>{postTypeIcon}</Text>

          {/* LIVE badge */}
          {post.isLive && (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: '#FF4F4F',
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 4,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' }} />
              <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'SpaceGrotesk-Bold' }}>LIVE</Text>
            </View>
          )}
        </View>

        {/* Caption */}
        <Text
          style={{
            color: DJCOLORS.text,
            fontSize: 14,
            fontFamily: 'SpaceGrotesk-Regular',
            paddingHorizontal: 14,
            marginBottom: 12,
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
          <AnimatedPressable onPress={handleLike} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>{likeEmoji}</Text>
              <Text style={{ color: likeColor, fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
                {likeDisplay}
              </Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleComment} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>💬</Text>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
                {commentDisplay}
              </Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleShare} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>↗️</Text>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
                Share
              </Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleSave}>
            <Text style={{ fontSize: 18 }}>{savedEmoji}</Text>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleMore} style={{ marginLeft: 4 }}>
            <Text style={{ color: DJCOLORS.textSecondary, fontSize: 18, lineHeight: 22 }}>···</Text>
          </AnimatedPressable>
        </View>

        {/* Time ago */}
        <Text
          style={{
            color: DJCOLORS.textSecondary,
            fontSize: 11,
            fontFamily: 'SpaceGrotesk-Regular',
            paddingHorizontal: 14,
            paddingBottom: 12,
            marginTop: -8,
          }}
        >
          {post.timeAgo}
        </Text>

        {/* More menu */}
        {showMore && (
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
            <AnimatedPressable onPress={handleReport}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: DJCOLORS.divider,
                }}
              >
                <Text style={{ color: DJCOLORS.danger, fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' }}>
                  🚫 Report
                </Text>
              </View>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleMute}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' }}>
                  🔕 Mute
                </Text>
              </View>
            </AnimatedPressable>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SocialFeedScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState(0);

  const handleFilterPress = (index: number) => {
    console.log(`[Social] Tab changed to ${FILTER_TABS[index].label}`);
    setActiveFilter(index);
  };

  const handleNotificationPress = () => {
    console.log('[Social] Notification bell pressed');
  };

  const handleDMPress = () => {
    console.log('[Social] DM icon pressed');
  };

  const renderPost = ({ item }: { item: Post }) => <PostCard post={item} />;
  const keyExtractor = (item: Post) => item.id;

  const ListHeader = (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
        }}
      >
        <Text style={{ fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text, letterSpacing: 2 }}>
          DJ
          <Text style={{ color: DJCOLORS.primary }}>VERSE</Text>
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <AnimatedPressable onPress={handleNotificationPress}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <Bell size={18} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleDMPress}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
              }}
            >
              <MessageCircle size={18} color={DJCOLORS.textSecondary} />
            </View>
          </AnimatedPressable>
        </View>
      </View>

      {/* Stories bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {STORIES.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </ScrollView>

      {/* Filter tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 4 }}>
        {FILTER_TABS.map((tab, i) => {
          const isActive = activeFilter === i;
          const tabLabel = tab.label;
          const tabIcon = tab.icon;
          return (
            <AnimatedPressable key={tab.label} onPress={() => handleFilterPress(i)} style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 8,
                  alignItems: 'center',
                  borderBottomWidth: 2,
                  borderBottomColor: isActive ? DJCOLORS.primary : 'transparent',
                }}
              >
                <Text style={{ fontSize: 13, marginBottom: 1 }}>{tabIcon}</Text>
                <Text
                  style={{
                    color: isActive ? DJCOLORS.primary : DJCOLORS.textSecondary,
                    fontSize: 11,
                    fontFamily: isActive ? 'SpaceGrotesk-Bold' : 'SpaceGrotesk-Medium',
                  }}
                >
                  {tabLabel}
                </Text>
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <FlatList
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
