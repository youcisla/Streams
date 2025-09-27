import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Badge, EmptyState, Modal } from '@streamlink/ui';
import { theme } from '@streamlink/ui';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../src/services/api';
import { Ionicons } from '@expo/vector-icons';

// Mock live interaction data for demo
const MOCK_LIVE_DATA = {
  polls: [
    {
      id: '1',
      question: 'What game should we play next?',
      status: 'OPEN' as const,
      options: [
        { id: '1', label: 'Minecraft', votes: 15 },
        { id: '2', label: 'Fortnite', votes: 8 },
        { id: '3', label: 'Among Us', votes: 12 },
        { id: '4', label: 'Valorant', votes: 5 }
      ],
      createdAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  ],
  pointsBalance: 1250,
  activeStreamers: [
    {
      id: '1',
      displayName: 'GamerPro123',
      platform: 'TWITCH',
      title: 'Ranked Valorant Grind!',
      viewers: 1420,
    },
    {
      id: '2',
      displayName: 'MusicMaven',
      platform: 'YOUTUBE',
      title: 'Live Music Session',
      viewers: 850,
    }
  ]
};

export default function LiveScreen() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const { data: rewards } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => api.getRewards(),
    enabled: false, // Enable when we have a selected streamer
  });

  const handleVote = (pollId: string, optionId: string) => {
    console.log('Voting in poll:', pollId, 'option:', optionId);
    // In real app, this would call api.votePoll
    setSelectedPoll(null);
  };

  const handleRedeem = (rewardId: string) => {
    console.log('Redeeming reward:', rewardId);
    // In real app, this would call api.redeemReward
    setShowRedeemModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Interactions</Text>
          <Text style={styles.subtitle}>Engage with your favorite streamers</Text>
        </View>

        {/* Points Balance */}
        <Card style={styles.pointsCard} variant="elevated">
          <View style={styles.pointsHeader}>
            <Text style={styles.pointsTitle}>Your Points</Text>
            <Text style={styles.pointsBalance}>{MOCK_LIVE_DATA.pointsBalance.toLocaleString()}</Text>
          </View>
          <Button
            title="Redeem Rewards"
            variant="primary"
            size="small"
            onPress={() => setShowRedeemModal(true)}
          />
        </Card>

        {/* Active Streamers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Now</Text>
          {MOCK_LIVE_DATA.activeStreamers.map((streamer) => (
            <LiveStreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </View>

        {/* Active Polls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Polls</Text>
          {MOCK_LIVE_DATA.polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVote={() => setSelectedPoll(poll.id)}
            />
          ))}
        </View>

        {/* Mini Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mini Games</Text>
          <Card style={styles.emptyCard}>
            <EmptyState
              title="No active games"
              description="Check back later for trivia and prediction games"
              icon={<Ionicons name="game-controller-outline" size={48} color={theme.colors.textMuted} />}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Poll Voting Modal */}
      <Modal
        visible={selectedPoll !== null}
        onClose={() => setSelectedPoll(null)}
      >
        {selectedPoll && (
          <PollVotingModal
            poll={MOCK_LIVE_DATA.polls.find(p => p.id === selectedPoll)!}
            onVote={handleVote}
            onClose={() => setSelectedPoll(null)}
          />
        )}
      </Modal>

      {/* Redeem Modal */}
      <Modal
        visible={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
      >
        <RedeemModal
          pointsBalance={MOCK_LIVE_DATA.pointsBalance}
          onRedeem={handleRedeem}
          onClose={() => setShowRedeemModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const LiveStreamerCard = ({ streamer }: { streamer: any }) => (
  <Card style={styles.streamerCard}>
    <View style={styles.streamerHeader}>
      <View style={styles.streamerInfo}>
        <Text style={styles.streamerName}>{streamer.displayName}</Text>
        <Text style={styles.streamerTitle}>{streamer.title}</Text>
        <View style={styles.streamerMeta}>
          <Badge label="LIVE" variant="error" size="small" />
          <Badge label={streamer.platform} platform={streamer.platform.toLowerCase() as any} size="small" />
          <Text style={styles.viewerCount}>
            {streamer.viewers.toLocaleString()} viewers
          </Text>
        </View>
      </View>
    </View>
    <Button
      title="Join Stream"
      variant="primary"
      size="small"
      onPress={() => {}}
    />
  </Card>
);

const PollCard = ({ poll, onVote }: { poll: any; onVote: () => void }) => (
  <Card style={styles.pollCard}>
    <Text style={styles.pollQuestion}>{poll.question}</Text>
    <View style={styles.pollOptions}>
      {poll.options.map((option: any) => (
        <View key={option.id} style={styles.pollOption}>
          <Text style={styles.pollOptionLabel}>{option.label}</Text>
          <Text style={styles.pollOptionVotes}>{option.votes} votes</Text>
        </View>
      ))}
    </View>
    <Button
      title="Vote"
      variant="outline"
      size="small"
      onPress={onVote}
      style={styles.voteButton}
    />
  </Card>
);

const PollVotingModal = ({ poll, onVote, onClose }: { poll: any; onVote: (pollId: string, optionId: string) => void; onClose: () => void }) => (
  <View>
    <Text style={styles.modalTitle}>{poll.question}</Text>
    <View style={styles.pollVotingOptions}>
      {poll.options.map((option: any) => (
        <Button
          key={option.id}
          title={`${option.label} (${option.votes} votes)`}
          variant="outline"
          onPress={() => onVote(poll.id, option.id)}
          style={styles.voteOptionButton}
        />
      ))}
    </View>
    <Button
      title="Cancel"
      variant="ghost"
      onPress={onClose}
    />
  </View>
);

const RedeemModal = ({ 
  pointsBalance, 
  onRedeem, 
  onClose 
}: { 
  pointsBalance: number; 
  onRedeem: (rewardId: string) => void; 
  onClose: () => void; 
}) => {
  // Mock rewards for demo
  const mockRewards = [
    { id: '1', title: 'Shoutout', costPoints: 100, description: 'Get a shoutout on stream' },
    { id: '2', title: 'Song Request', costPoints: 50, description: 'Request a song to be played' },
    { id: '3', title: 'Discord VIP', costPoints: 500, description: 'Get VIP role in Discord' },
  ];

  return (
    <View>
      <Text style={styles.modalTitle}>Redeem Rewards</Text>
      <Text style={styles.pointsBalanceText}>
        Available Points: {pointsBalance.toLocaleString()}
      </Text>
      <View style={styles.rewardsContainer}>
        {mockRewards.map((reward) => (
          <Card key={reward.id} style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            <Text style={styles.rewardCost}>{reward.costPoints} points</Text>
            <Button
              title="Redeem"
              variant={pointsBalance >= reward.costPoints ? "primary" : "secondary"}
              disabled={pointsBalance < reward.costPoints}
              size="small"
              onPress={() => onRedeem(reward.id)}
            />
          </Card>
        ))}
      </View>
      <Button
        title="Close"
        variant="ghost"
        onPress={onClose}
      />
    </View>
  );
};

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
  title: {
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
  pointsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  pointsTitle: {
    ...theme.typography.h4,
  },
  pointsBalance: {
    ...theme.typography.h3,
    color: theme.colors.primary,
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
  streamerName: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
  },
  streamerTitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  streamerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  viewerCount: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  pollCard: {
    marginBottom: theme.spacing.md,
  },
  pollQuestion: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.md,
  },
  pollOptions: {
    marginBottom: theme.spacing.md,
  },
  pollOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pollOptionLabel: {
    ...theme.typography.body,
  },
  pollOptionVotes: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  voteButton: {
    alignSelf: 'flex-start',
  },
  emptyCard: {
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  pollVotingOptions: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  voteOptionButton: {
    marginBottom: theme.spacing.sm,
  },
  pointsBalanceText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  rewardsContainer: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  rewardCard: {
    padding: theme.spacing.sm,
  },
  rewardTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
  },
  rewardDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  rewardCost: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
});