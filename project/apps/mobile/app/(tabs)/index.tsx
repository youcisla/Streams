import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, EmptyState, theme } from '@streamlink/ui';
import { useQuery } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toBadgePlatform } from '../../src/constants/platforms';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/auth';
import type { DashboardStats, Follow } from '../../src/types/api';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const isStreamer = user?.role === 'STREAMER' || user?.role === 'BOTH';
  const isViewer = user?.role === 'VIEWER' || user?.role === 'BOTH';

  const { data: following, isLoading: followingLoading, refetch: refetchFollowing } = useQuery<Follow[]>({
    queryKey: ['following'],
    queryFn: () => api.getFollowing(),
    enabled: isViewer,
  });

  const { data: dashboardStats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
    enabled: isStreamer,
  });

  const liveStreamers = (following ?? []).filter((follow) => follow.streamer.liveStatuses.length > 0);
  const upcomingStreamers = following?.slice(0, 5) ?? [];

  const handleRefresh = () => {
    refetchFollowing();
    refetchStats();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={followingLoading || statsLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome back, {user?.displayName || 'Streamer'}!
          </Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {isStreamer && (
          <Card style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <StatItem 
                label="Followers" 
                value={dashboardStats?.followers || 0} 
                icon="people"
              />
              <StatItem 
                label="Total Views" 
                value={dashboardStats?.totalViews || 0} 
                icon="eye"
              />
              <StatItem 
                label="Recent Content" 
                value={dashboardStats?.recentContent || 0} 
                icon="videocam"
              />
              <StatItem 
                label="Pending Rewards" 
                value={dashboardStats?.pendingRedemptions || 0} 
                icon="gift"
              />
            </View>
          </Card>
        )}

        {isViewer && (
          <>
            {liveStreamers.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live Now</Text>
                {liveStreamers.map((follow) => (
                  <LiveStreamerCard key={follow.id} follow={follow} />
                ))}
              </View>
            ) : (
              <Card style={styles.emptyCard}>
                <EmptyState
                  title="No one is live"
                  description="None of your followed streamers are currently streaming"
                  icon={<Ionicons name="videocam-off" size={48} color={theme.colors.textMuted} />}
                />
              </Card>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Following</Text>
              {upcomingStreamers.length > 0 ? (
                upcomingStreamers.map((follow) => (
                  <FollowCard key={follow.id} follow={follow} />
                ))
              ) : (
                <Card style={styles.emptyCard}>
                  <EmptyState
                    title="No followed streamers"
                    description="Discover and follow streamers to see them here"
                    icon={<Ionicons name="heart-outline" size={48} color={theme.colors.textMuted} />}
                    action={
                      <Button 
                        title="Discover Streamers" 
                        variant="outline"
                        size="small"
                        onPress={() => {}}
                      />
                    }
                  />
                </Card>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const StatItem = ({ label, value, icon }: { label: string; value: number; icon: IoniconName }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={24} color={theme.colors.primary} />
    <Text style={styles.statValue}>{value.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const LiveStreamerCard = ({ follow }: { follow: Follow }) => {
  const primaryStatus = follow.streamer.liveStatuses[0];
  const platformBadge = primaryStatus ? toBadgePlatform(primaryStatus.platform) : undefined;

  return (
  <Card style={styles.streamerCard} variant="elevated">
    <View style={styles.streamerHeader}>
      <View style={styles.streamerInfo}>
        <Text style={styles.streamerName}>{follow.streamer.displayName}</Text>
        <Badge label="LIVE" variant="error" size="small" />
        {platformBadge && (
          <Badge label={primaryStatus?.platform ?? 'LIVE'} platform={platformBadge} size="small" />
        )}
      </View>
      <Text style={styles.liveTitle}>
        {follow.streamer.liveStatuses[0]?.title || 'Untitled Stream'}
      </Text>
    </View>
    <Button title="Watch Now" variant="primary" size="small" onPress={() => {}} />
  </Card>
  );
};

const FollowCard = ({ follow }: { follow: Follow }) => (
  <Card style={styles.streamerCard}>
    <View style={styles.streamerInfo}>
      <Text style={styles.streamerName}>{follow.streamer.displayName}</Text>
      <Text style={styles.streamerBio} numberOfLines={2}>
        {follow.streamer.streamerProfile?.bio || 'No bio available'}
      </Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  statsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  streamerCard: {
    marginBottom: theme.spacing.md,
  },
  streamerHeader: {
    marginBottom: theme.spacing.md,
  },
  streamerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  streamerName: {
    ...theme.typography.h4,
  },
  streamerBio: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  liveTitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  emptyCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
});