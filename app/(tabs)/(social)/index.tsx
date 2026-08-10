import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, MessageCircle } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const FILTER_TABS = ['For You', 'Following', 'DJ', 'Trending'];

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

function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const userTypeBadge = USER_TYPE_BADGE[post.userType];
  const postTypeBadge = POST_TYPE_BADGE[post.postType];
  const postTypeIcon = POST_TYPE_ICON[post.postType];
  const likeDisplay = formatCount(likeCount);
  const commentDisplay = formatCount(post.comments);

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
    console.log(`[Social] More pressed on post ${post.id}`);
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
          {/* Avatar */}
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

          {/* Username + badge */}
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

          {/* Follow button */}
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
          }}
        >
          <Text style={{ fontSize: 40 }}>{postTypeIcon}</Text>
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
          {/* Like */}
          <AnimatedPressable onPress={handleLike} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>{liked ? '❤️' : '🤍'}</Text>
              <Text
                style={{
                  color: liked ? '#FF4F4F' : DJCOLORS.textSecondary,
                  fontSize: 12,
                  fontFamily: 'SpaceGrotesk-Medium',
                }}
              >
                {likeDisplay}
              </Text>
            </View>
          </AnimatedPressable>

          {/* Comment */}
          <AnimatedPressable onPress={handleComment} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>💬</Text>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
                {commentDisplay}
              </Text>
            </View>
          </AnimatedPressable>

          {/* Share */}
          <AnimatedPressable onPress={handleShare} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>↗️</Text>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' }}>
                Share
              </Text>
            </View>
          </AnimatedPressable>

          {/* Save */}
          <AnimatedPressable onPress={handleSave}>
            <Text style={{ fontSize: 18 }}>{saved ? '🔖' : '🔖'}</Text>
          </AnimatedPressable>

          {/* More */}
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
      </View>
    </AnimatedPressable>
  );
}

export default function SocialFeedScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState(0);

  const handleFilterPress = (index: number) => {
    console.log(`[Social] Tab changed to ${FILTER_TABS[index]}`);
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
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'SpaceGrotesk-Bold',
            color: DJCOLORS.text,
            letterSpacing: 2,
          }}
        >
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

      {/* Filter tabs */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginBottom: 16,
          gap: 4,
        }}
      >
        {FILTER_TABS.map((tab, i) => {
          const isActive = activeFilter === i;
          return (
            <AnimatedPressable key={tab} onPress={() => handleFilterPress(i)} style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 8,
                  alignItems: 'center',
                  borderBottomWidth: 2,
                  borderBottomColor: isActive ? DJCOLORS.primary : 'transparent',
                }}
              >
                <Text
                  style={{
                    color: isActive ? DJCOLORS.primary : DJCOLORS.textSecondary,
                    fontSize: 13,
                    fontFamily: isActive ? 'SpaceGrotesk-Bold' : 'SpaceGrotesk-Medium',
                  }}
                >
                  {tab}
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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
