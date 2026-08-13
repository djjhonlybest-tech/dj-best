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
import { ArrowLeft, Search, X, Users } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  username: string;
  userType: 'DJ' | 'Creator';
  avatarColor: string;
  initials: string;
  followers: string;
  isOnline: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SUGGESTED_CONTACTS: Contact[] = [
  {
    id: '1',
    username: 'DJ STORM',
    userType: 'DJ',
    avatarColor: '#FF4F4F',
    initials: 'DS',
    followers: '24.5K',
    isOnline: true,
  },
  {
    id: '2',
    username: 'MARIE_CREATOR',
    userType: 'Creator',
    avatarColor: '#FF4FC8',
    initials: 'MC',
    followers: '8.2K',
    isOnline: true,
  },
  {
    id: '3',
    username: 'DJ NOVA',
    userType: 'DJ',
    avatarColor: '#4FC8FF',
    initials: 'DN',
    followers: '41.1K',
    isOnline: false,
  },
  {
    id: '4',
    username: 'KOMPA KING',
    userType: 'DJ',
    avatarColor: '#FFB800',
    initials: 'KK',
    followers: '18.7K',
    isOnline: true,
  },
  {
    id: '5',
    username: 'PARTY_QUEEN',
    userType: 'Creator',
    avatarColor: '#34D399',
    initials: 'PQ',
    followers: '5.9K',
    isOnline: false,
  },
  {
    id: '6',
    username: 'DJ BEATS',
    userType: 'DJ',
    avatarColor: '#A04FFF',
    initials: 'DB',
    followers: '33.0K',
    isOnline: true,
  },
  {
    id: '7',
    username: 'FANATIC_BEATS',
    userType: 'Creator',
    avatarColor: '#4FC8FF',
    initials: 'FB',
    followers: '2.1K',
    isOnline: false,
  },
  {
    id: '8',
    username: 'DJ JHONLYBEST',
    userType: 'DJ',
    avatarColor: '#7B4FFF',
    initials: 'JB',
    followers: '102K',
    isOnline: false,
  },
];

// ─── Animated Contact Item ────────────────────────────────────────────────────

function AnimatedContactItem({
  item,
  index,
  onPress,
}: {
  item: Contact;
  index: number;
  onPress: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const badgeLabel = item.userType === 'DJ' ? '🎧 DJ' : '📱 Creator';
  const followersText = item.followers + ' followers';

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <AnimatedPressable onPress={onPress}>
        <View style={styles.contactRow}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: item.avatarColor + '33' }]}>
              <Text style={[styles.avatarInitials, { color: item.avatarColor }]}>
                {item.initials}
              </Text>
            </View>
            {item.isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.contactInfo}>
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
            <Text style={styles.followers}>{followersText}</Text>
          </View>

          <View style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Message</Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function NewMessageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? SUGGESTED_CONTACTS.filter((c) =>
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SUGGESTED_CONTACTS;

  const handleContactPress = (item: Contact) => {
    console.log(`[NewMessage] Selected contact: ${item.username} (id=${item.id})`);
    router.replace(`/messages/${item.id}` as any);
  };

  const handleBack = () => {
    console.log('[NewMessage] Tapped back');
    router.back();
  };

  const handleSearchChange = (text: string) => {
    console.log(`[NewMessage] Search query: "${text}"`);
    setSearchQuery(text);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack}>
          <View style={styles.backButton}>
            <ArrowLeft size={22} color={DJCOLORS.text} />
          </View>
        </AnimatedPressable>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={16} color={DJCOLORS.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search DJs and Creators..."
          placeholderTextColor={DJCOLORS.textTertiary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <X size={16} color={DJCOLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Label */}
      <View style={styles.sectionHeader}>
        <Users size={14} color={DJCOLORS.textTertiary} />
        <Text style={styles.sectionLabel}>
          {searchQuery.trim() ? 'Search Results' : 'Suggested'}
        </Text>
      </View>

      {/* Contacts List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedContactItem
            item={item}
            index={index}
            onPress={() => handleContactPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>Try searching by username</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: DJCOLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DJCOLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Bold',
    letterSpacing: -0.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: DJCOLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DJCOLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Regular',
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DJCOLORS.textTertiary,
    fontFamily: 'SpaceGrotesk-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  listContent: {
    paddingBottom: 100,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DJCOLORS.divider,
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk-Bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: DJCOLORS.success,
    borderWidth: 2,
    borderColor: DJCOLORS.background,
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  followers: {
    fontSize: 12,
    color: DJCOLORS.textSecondary,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  messageButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: DJCOLORS.primaryMuted,
    borderWidth: 1,
    borderColor: DJCOLORS.primary + '50',
  },
  messageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: DJCOLORS.primary,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DJCOLORS.text,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  emptySubtitle: {
    fontSize: 14,
    color: DJCOLORS.textSecondary,
    fontFamily: 'SpaceGrotesk-Regular',
  },
});
