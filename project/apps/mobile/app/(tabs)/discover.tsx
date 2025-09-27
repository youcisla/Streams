import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Badge, EmptyState, Input } from '@streamlink/ui';
import { theme } from '@streamlink/ui';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demo purposes
const MOCK_STREAMERS = [
  {
    id: '1',
    displayName: 'GamerPro123',
    bio: 'Professional Valorant player and content creator',
    platforms: ['TWITCH', 'YOUTUBE'],
    followers: 15420,
    isLive: true,
    category: 'Gaming',
  },
  {
    id: '2',
    displayName: 'ArtisticSoul',
    bio: 'Digital artist creating amazing illustrations',
    platforms: ['INSTAGRAM', 'TIKTOK'],
    followers: 8930,
    isLive: false,
    category: 'Art',
  },
  {
    id: '3',
    displayName: 'MusicMaven',
    bio: 'Indie musician and producer sharing my journey',
    platforms: ['YOUTUBE', 'INSTAGRAM'],
    followers: 23150,
    isLive: true,
    category: 'Music',
  },
  {
    id: '4',
    displayName: 'CodeWizard',
    bio: 'Software engineer teaching programming concepts',
    platforms: ['TWITCH', 'YOUTUBE'],
    followers: 12300,
    isLive: false,
    category: 'Education',
  },
];

const CATEGORIES = ['All', 'Gaming', 'Art', 'Music', 'Education', 'Lifestyle'];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followedStreamers, setFollowedStreamers] = useState<Set<string>>(new Set());

  const filteredStreamers = MOCK_STREAMERS.filter(streamer => {
    const matchesSearch = streamer.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         streamer.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || streamer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFollow = (streamerId: string) => {
    const newFollowed = new Set(followedStreamers);
    if (newFollowed.has(streamerId)) {
      newFollowed.delete(streamerId);
    } else {
      newFollowed.add(streamerId);
    }
    setFollowedStreamers(newFollowed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Find amazing streamers and creators</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.textMuted} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search streamers..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        <View style={styles.categories}>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              title={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="small"
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryButton}
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.streamersContainer}>
        {filteredStreamers.length > 0 ? (
          <View style={styles.streamersList}>
            {filteredStreamers.map((streamer) => (
              <StreamerCard
                key={streamer.id}
                streamer={streamer}
                isFollowed={followedStreamers.has(streamer.id)}
                onFollow={() => handleFollow(streamer.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No streamers found"
            description={
              searchQuery 
                ? `No results for "${searchQuery}"`
                : "No streamers in this category"
            }
            icon={<Ionicons name="person-outline" size={48} color={theme.colors.textMuted} />}
            action={
              <Button
                title="Clear Search"
                variant="outline"
                size="small"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              />
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const StreamerCard = ({ 
  streamer, 
  isFollowed, 
  onFollow 
}: { 
  streamer: any; 
  isFollowed: boolean; 
  onFollow: () => void; 
}) => (
  <Card style={styles.streamerCard} variant="elevated">
    <View style={styles.streamerHeader}>
      <View style={styles.streamerInfo}>
        <View style={styles.streamerNameRow}>
          <Text style={styles.streamerName}>{streamer.displayName}</Text>
          {streamer.isLive && (
            <Badge label="LIVE" variant="error" size="small" />
          )}
        </View>
        <Text style={styles.streamerBio} numberOfLines={2}>
          {streamer.bio}
        </Text>
        <View style={styles.streamerMeta}>
          <Text style={styles.followersCount}>
            {streamer.followers.toLocaleString()} followers
          </Text>
          <View style={styles.platformsContainer}>
            {streamer.platforms.map((platform: string) => (
              <Badge
                key={platform}
                label={platform}
                platform={platform.toLowerCase() as any}
                size="small"
                style={styles.platformBadge}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
    
    <View style={styles.streamerActions}>
      <Button
        title={isFollowed ? 'Following' : 'Follow'}
        variant={isFollowed ? 'secondary' : 'primary'}
        size="small"
        onPress={onFollow}
        style={styles.followButton}
      />
      <Button
        title="View Profile"
        variant="outline"
        size="small"
        onPress={() => {}}
        style={styles.profileButton}
      />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.md,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.md,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    marginRight: theme.spacing.xs,
  },
  streamersContainer: {
    flex: 1,
  },
  streamersList: {
    padding: theme.spacing.lg,
  },
  streamerCard: {
    marginBottom: theme.spacing.md,
  },
  streamerHeader: {
    marginBottom: theme.spacing.md,
  },
  streamerInfo: {
    flex: 1,
  },
  streamerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  streamerName: {
    ...theme.typography.h4,
    flex: 1,
  },
  streamerBio: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  streamerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followersCount: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  platformsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  platformBadge: {
    marginLeft: theme.spacing.xs,
  },
  streamerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  followButton: {
    flex: 1,
  },
  profileButton: {
    flex: 1,
  },
});