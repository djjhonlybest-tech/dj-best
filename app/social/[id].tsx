import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

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
  { id: '1', username: 'DJ JHONLYBEST', userType: 'DJ', postType: 'Mix', caption: 'New Afrobeat set 🔥 BPM 128', likes: 2400, comments: 89, timeAgo: '2h ago', avatarColor: '#7B4FFF', contentColor: '#1A0A3A' },
  { id: '2', username: 'MARIE_CREATOR', userType: 'Creator', postType: 'Photo', caption: 'Party vibes last night 🎉', likes: 1100, comments: 34, timeAgo: '4h ago', avatarColor: '#FF4FC8', contentColor: '#0A1A3A' },
  { id: '3', username: 'DJ STORM', userType: 'DJ', postType: 'Battle', caption: 'Who wants to battle? 👊', likes: 3200, comments: 156, timeAgo: '5h ago', avatarColor: '#FF4F4F', contentColor: '#3A0A0A' },
  { id: '4', username: 'FANATIC_BEATS', userType: 'Fan', postType: 'Video', caption: 'This transition is insane 😱', likes: 892, comments: 67, timeAgo: '7h ago', avatarColor: '#4FC8FF', contentColor: '#0A2A1A' },
  { id: '5', username: 'DJ KOMPA KING', userType: 'DJ', postType: 'Short', caption: 'Kompa x Afrobeat fusion 🌴', likes: 5600, comments: 234, timeAgo: '9h ago', avatarColor: '#FFB84F', contentColor: '#2A0A2A' },
  { id: '6', username: 'PARTY_QUEEN', userType: 'Creator', postType: 'Event', caption: 'DJ BEST PARTY — Port-au-Prince 📍 Dec 28', likes: 2100, comments: 98, timeAgo: '12h ago', avatarColor: '#4FFF8A', contentColor: '#1A2A0A' },
  { id: '7', username: 'DJ NOVA', userType: 'DJ', postType: 'Mix', caption: 'House music all night long 🏠', likes: 1800, comments: 45, timeAgo: '1d ago', avatarColor: '#A04FFF', contentColor: '#1A0A3A' },
  { id: '8', username: 'MUSIC_LOVER', userType: 'Fan', postType: 'Photo', caption: 'Best night ever with @DJSTORM', likes: 445, comments: 22, timeAgo: '1d ago', avatarColor: '#FF8A4F', contentColor: '#0A1A3A' },
];

const MOCK_COMMENTS = [
  { id: 'c1', username: 'BEAT_MASTER', text: 'This is absolute fire 🔥🔥🔥', likes: 142, avatarColor: '#7B4FFF' },
  { id: 'c2', username: 'VIBES_ONLY', text: 'Bro you killed it again! 🎧', likes: 87, avatarColor: '#FF4FC8' },
  { id: 'c3', username: 'DJ_ROOKIE', text: 'What software do you use for this?', likes: 34, avatarColor: '#4FC8FF' },
  { id: 'c4', username: 'HAITIAN_QUEEN', text: 'Represent Haiti 🇭🇹❤️', likes: 211, avatarColor: '#FFB84F' },
  { id: 'c5', username: 'MUSIC_NERD', text: 'The BPM transition at 2:34 is insane', likes: 56, avatarColor: '#4FFF8A' },
];

const USER_TYPE_BADGE: Record<UserType, string> = {
  DJ: '🎧 DJ',
  Creator: '📱 Creator',
  Fan: '❤️ Fan',
};

const POST_TYPE_ICON: Record<PostType, string> = {
  Mix: '🎧',
  Photo: '📸',
  Battle: '🏆',
  Video: '🎥',
  Short: '🎵',
  Event: '📍',
};

const POST_TYPE_BADGE: Record<PostType, string> = {
  Mix: '🎧 Mix',
  Photo: '📸 Photo',
  Battle: '🏆 Battle',
  Video: '🎥 Video',
  Short: '🎵 Short',
  Event: '📍 Event',
};

function formatCount(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(n);
}

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const post = POSTS.find((p) => p.id === id) ?? POSTS[0];
  const [likeCount, setLikeCount] = useState(post.likes);

  const userTypeBadge = USER_TYPE_BADGE[post.userType];
  const postTypeBadge = POST_TYPE_BADGE[post.postType];
  const postTypeIcon = POST_TYPE_ICON[post.postType];
  const likeDisplay = formatCount(likeCount);
  const commentDisplay = formatCount(post.comments);

  const handleBack = () => {
    console.log('[Social] Back button pressed on post detail');
    router.back();
  };

  const handleLike = () => {
    console.log(`[Social] Like pressed on post detail ${post.id}`);
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked((v) => !v);
  };

  const handleShare = () => {
    console.log(`[Social] Share pressed on post detail ${post.id}`);
  };

  const handleSave = () => {
    console.log(`[Social] Save pressed on post detail ${post.id}`);
    setSaved((v) => !v);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    console.log(`[Social] Comment sent on post ${post.id}: "${commentText}"`);
    setCommentText('');
  };

  const handleCommentLike = (commentId: string) => {
    console.log(`[Social] Comment like pressed: ${commentId}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DJCOLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: DJCOLORS.border,
          backgroundColor: DJCOLORS.background,
        }}
      >
        <AnimatedPressable onPress={handleBack}>
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
              marginRight: 12,
            }}
          >
            <ArrowLeft size={18} color={DJCOLORS.text} />
          </View>
        </AnimatedPressable>
        <Text
          style={{
            color: DJCOLORS.text,
            fontSize: 16,
            fontFamily: 'SpaceGrotesk-Bold',
            letterSpacing: 1,
          }}
        >
          POST
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Full Post Card */}
        <View
          style={{
            backgroundColor: DJCOLORS.surface,
            borderRadius: 16,
            margin: 16,
            borderWidth: 1,
            borderColor: DJCOLORS.border,
            overflow: 'hidden',
          }}
        >
          {/* Post type badge */}
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

          {/* Header */}
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
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: post.avatarColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' }}>
                {post.username.slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: DJCOLORS.text, fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 2 }}>
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
            <Text style={{ color: DJCOLORS.textSecondary, fontSize: 12, fontFamily: 'SpaceGrotesk-Regular' }}>
              {post.timeAgo}
            </Text>
          </View>

          {/* Content placeholder — taller for detail view */}
          <View
            style={{
              marginHorizontal: 14,
              borderRadius: 12,
              backgroundColor: post.contentColor,
              aspectRatio: 4 / 3,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
            }}
          >
            <Text style={{ fontSize: 56 }}>{postTypeIcon}</Text>
          </View>

          {/* Caption */}
          <Text
            style={{
              color: DJCOLORS.text,
              fontSize: 15,
              fontFamily: 'SpaceGrotesk-Regular',
              paddingHorizontal: 14,
              marginBottom: 14,
              lineHeight: 22,
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 20 }}>{liked ? '❤️' : '🤍'}</Text>
                <Text
                  style={{
                    color: liked ? '#FF4F4F' : DJCOLORS.textSecondary,
                    fontSize: 13,
                    fontFamily: 'SpaceGrotesk-Medium',
                  }}
                >
                  {likeDisplay}
                </Text>
              </View>
            </AnimatedPressable>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 20 }}>💬</Text>
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Medium' }}>
                  {commentDisplay}
                </Text>
              </View>
            </View>

            <AnimatedPressable onPress={handleShare} style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 20 }}>↗️</Text>
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Medium' }}>
                  Share
                </Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable onPress={handleSave}>
              <Text style={{ fontSize: 20 }}>{saved ? '🔖' : '🔖'}</Text>
            </AnimatedPressable>
          </View>
        </View>

        {/* Comments section */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text
            style={{
              color: DJCOLORS.text,
              fontSize: 13,
              fontFamily: 'SpaceGrotesk-Bold',
              letterSpacing: 1.5,
              marginBottom: 14,
            }}
          >
            COMMENTS
          </Text>

          {MOCK_COMMENTS.map((comment) => {
            const commentLikeDisplay = formatCount(comment.likes);
            return (
              <View
                key={comment.id}
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  marginBottom: 16,
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: comment.avatarColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>
                    {comment.username.slice(0, 2)}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: DJCOLORS.surface,
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: DJCOLORS.border,
                  }}
                >
                  <Text
                    style={{
                      color: DJCOLORS.primary,
                      fontSize: 12,
                      fontFamily: 'SpaceGrotesk-Bold',
                      marginBottom: 4,
                    }}
                  >
                    {comment.username}
                  </Text>
                  <Text
                    style={{
                      color: DJCOLORS.text,
                      fontSize: 13,
                      fontFamily: 'SpaceGrotesk-Regular',
                      lineHeight: 19,
                    }}
                  >
                    {comment.text}
                  </Text>
                </View>

                <AnimatedPressable onPress={() => handleCommentLike(comment.id)}>
                  <View style={{ alignItems: 'center', gap: 2, paddingTop: 8 }}>
                    <Text style={{ fontSize: 16 }}>🤍</Text>
                    <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Medium' }}>
                      {commentLikeDisplay}
                    </Text>
                  </View>
                </AnimatedPressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Comment input bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          borderTopWidth: 1,
          borderTopColor: DJCOLORS.border,
          backgroundColor: DJCOLORS.background,
          gap: 10,
        }}
      >
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          placeholderTextColor={DJCOLORS.textSecondary}
          style={{
            flex: 1,
            backgroundColor: DJCOLORS.surface,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 10,
            color: DJCOLORS.text,
            fontSize: 14,
            fontFamily: 'SpaceGrotesk-Regular',
            borderWidth: 1,
            borderColor: DJCOLORS.border,
          }}
          onFocus={() => console.log('[Social] Comment input focused')}
        />
        <AnimatedPressable onPress={handleSendComment}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: DJCOLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={18} color="#fff" />
          </View>
        </AnimatedPressable>
      </View>
    </KeyboardAvoidingView>
  );
}
