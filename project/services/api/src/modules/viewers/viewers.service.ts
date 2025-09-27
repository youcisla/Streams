import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ViewersService {
  constructor(private prisma: PrismaService) {}

  async followStreamer(viewerId: string, streamerId: string) {
    // Check if streamer exists
    const streamer = await this.prisma.user.findUnique({
      where: { id: streamerId },
      include: { streamerProfile: true },
    });

    if (!streamer || !streamer.streamerProfile) {
      throw new NotFoundException('Streamer not found');
    }

    return this.prisma.follow.upsert({
      where: {
        viewerId_streamerId: {
          viewerId,
          streamerId,
        },
      },
      update: {
        notificationsEnabled: true,
      },
      create: {
        viewerId,
        streamerId,
        notificationsEnabled: true,
      },
    });
  }

  async unfollowStreamer(viewerId: string, streamerId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        viewerId_streamerId: {
          viewerId,
          streamerId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    return this.prisma.follow.delete({
      where: {
        viewerId_streamerId: {
          viewerId,
          streamerId,
        },
      },
    });
  }

  async getFollowing(viewerId: string) {
    return this.prisma.follow.findMany({
      where: { viewerId },
      include: {
        streamer: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            streamerProfile: {
              select: {
                bio: true,
              },
            },
            liveStatuses: {
              where: { isLive: true },
              select: {
                platform: true,
                title: true,
                startedAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async redeemReward(viewerId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
      include: { streamer: true },
    });

    if (!reward || !reward.isActive) {
      throw new NotFoundException('Reward not found or inactive');
    }

    // Check if user has enough points
    const pointsBalance = await this.getPointsBalance(viewerId, reward.streamerId);
    if (pointsBalance < reward.costPoints) {
      throw new BadRequestException('Insufficient points');
    }

    // Create redemption and deduct points in a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create redemption
      const redemption = await prisma.redemption.create({
        data: {
          rewardId,
          viewerId,
          streamerId: reward.streamerId,
        },
      });

      // Deduct points
      await prisma.pointsTransaction.create({
        data: {
          userId: viewerId,
          streamerId: reward.streamerId,
          delta: -reward.costPoints,
          reason: `Redeemed: ${reward.title}`,
          metadata: { redemptionId: redemption.id },
        },
      });

      return redemption;
    });
  }

  async getRedemptions(viewerId: string) {
    return this.prisma.redemption.findMany({
      where: { viewerId },
      include: {
        reward: {
          select: {
            title: true,
            description: true,
            costPoints: true,
          },
        },
        streamer: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getPointsBalance(userId: string, streamerId: string): Promise<number> {
    const transactions = await this.prisma.pointsTransaction.findMany({
      where: {
        userId,
        streamerId,
      },
    });

    return transactions.reduce((balance, transaction) => balance + transaction.delta, 0);
  }
}