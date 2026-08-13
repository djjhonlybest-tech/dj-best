import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Edit3, Search, X } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Conversation {
  id: string;
  username: string;
  userType: 'DJ' | 'Creator';
  avatarColor: string;
  initials: string;
  lastMessage: string;
  isVoice: boolean;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    username: 'DJ STORM',
    userType: 'DJ',
    avatarColor: '#FF4F4F',
    initials: 'DS',
    lastMessage: 'Yo bro, that set last night was FIRE 🔥',
    isVoice: false,
    timestamp: '2m',
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: '2',
    username: 'MARIE_CREATOR',
    userType: 'Creator',
    avatarColor: '#FF4FC8',
    initials: 'MC',
    lastMessage: '',
    isVoice: true,
    timestamp: '15m',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '3',
    username: 'DJ NOVA',
    userType: 'DJ',
    avatarColor: '#4FC8FF',
    initials: 'DN',
    lastMessage: 'Can you send me that mix file?',
    isVoice: false,
    timestamp: '1h',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '4',
    username: 'KOMPA KING',
    userType: 'DJ',
    avatarColor: '#FFB800',
    initials: 'KK',
    lastMessage: 'Let\'s collab on the next event 🎧',
    isVoice: false,
    timestamp: '3h',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '5',
    username: 'PARTY_QUEEN',
    userType: 'Creator',
    avatarColor: '#34D399',
    initials: 'PQ',
    lastMessage: '',
    isVoice: true,
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '6',
    username: 'DJ BEATS',
    userType: 'DJ',
    avatarColor: '#A04FFF',
    initials: 'DB',
    lastMessage: 'Check out my new Amapiano drop!',
    isVoice: false,
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '7',
    username: 'FANATIC_BEATS',
    userType: 'Creator',
    avatarColor: '#4FC8FF',
    initials: 'FB',
    lastMessage: 'That transition was insane 😱',
    isVoice: false,
    timestamp: '2d',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '8',
    username: 'DJ JHONLYBEST',
    userType: 'DJ',
    avatarColor: '#7B4FFF',
    initials: 'JB',
    lastMessage: '',
    isVoice: true,
    timestamp: '3d',
    unreadCount: 0,
    isOnline: false,
  },
];

// ─── Animated List Item ───────────────────────────────────────────────────────

function AnimatedConversationItem({
  item,
  index,
  onPress,
}: {
  item: Conversation;
  index: number;
  onPress: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 55,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const badgeLabel = item.userType === 'DJ' ? '🎧 DJ' : '📱 Creator';
  const lastMessageText = item.isVoice ? '🎤 Voice message' : item.lastMessage;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <AnimatedPressable onPress={onPress}>
        <View style={styles.conversationRow}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: item.avatarColor + '33' }]}>
              <Text style={[styles.avatarInitials, { color: item.avatarColor }]}>
                {item.initials}
              </Text>
            </View>
            {item.isOnline && <View style={styles.onlineDot} />}
          </View>

          {/* Content */}
          <View style={styles.conversationContent}>
            <View style={styles.conversationTopRow}>
              <View style={styles.nameRow}>
                <Text style={styles.username} numberOfLines={1}>
                  {item.username}
                </Text>
                <View style={[styles.typeBadge, { backgroundColor: item.avatarColor + '22' }]}>
                  <Text style={[styles.typeBadgeText, { color: item.avatarColor }]}>
                    {badgeLabel}
                  </Text>
                </View>
              </View>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <View style={styles.conversationBottomRow}>
              <Text
                style={[
                  styles.lastMessage,
                  item.unreadCount > 0 && styles.lastMessageUnread,
                  item.isVoice && styles.lastMessageVoice,
                ]}
                numberOfLines={1}
              >
                {lastMessageText}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? CONVERSATIONS.filter(
        (c) =>
          c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CONVERSATIONS;

  const handleConversationPress = (item: Conversation) => {
    console.log(`[Messages] Tapped conversation: ${item.username} (id=${item.id})`);
    router.push(`/messages/${item.id}` as any);
  };

  const handleComposePress = () => {
    console.log('[Messages] Tapped compose new message');
    router.push('/messages/new' as any);
  };

  const handleSearchChange = (text: string) => {
    console.log(`[Messages] Search query changed: "${text}"`);
    setSearchQuery(text);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <AnimatedPressable onPress={handleComposePress}>
          <View style={styles.composeButton}>
            <Edit3 size={20} color={DJCOLORS.primary} />
          </View>
        </AnimatedPressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color={DJCOLORS.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={DJCOLORS.textTertiary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <X size={16} color={DJCOLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Conversations List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedConversationItem
            item={item}
            index={index}
            onPress={() => handleConversationPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No conversations found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search or start a new message
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DJCOLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Bold',
    letterSpacing: -0.3,
  },
  composeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: DJCOLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DJCOLORS.primary + '40',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: DJCOLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DJCOLORS.border,
    gap: 10,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Regular',
    padding: 0,
  },
  listContent: {
    paddingBottom: 100,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DJCOLORS.divider,
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk-Bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DJCOLORS.success,
    borderWidth: 2,
    borderColor: DJCOLORS.background,
  },
  conversationContent: {
    flex: 1,
    gap: 5,
  },
  conversationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Medium',
    flexShrink: 1,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  timestamp: {
    fontSize: 12,
    color: DJCOLORS.textTertiary,
    fontFamily: 'SpaceGrotesk-Regular',
    flexShrink: 0,
  },
  conversationBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastMessage: {
    fontSize: 13,
    color: DJCOLORS.textSecondary,
    fontFamily: 'SpaceGrotesk-Regular',
    flex: 1,
  },
  lastMessageUnread: {
    color: DJCOLORS.text,
    fontWeight: '500',
  },
  lastMessageVoice: {
    color: DJCOLORS.primary,
    fontStyle: 'italic',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DJCOLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk-Bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  emptySubtitle: {
    fontSize: 14,
    color: DJCOLORS.textSecondary,
    fontFamily: 'SpaceGrotesk-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});
