import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Processor('stats')
export class StatsProcessor {
  private readonly logger = new Logger(StatsProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('create-daily-snapshots')
  async handleStatsSnapshot(job: Job) {
    this.logger.log('Creating daily stats snapshots');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all streamers with linked platform accounts
      const streamers = await this.prisma.user.findMany({
        where: {
          role: { in: ['STREAMER', 'BOTH'] },
          linkedPlatformAccounts: {
            some: {},
          },
        },
        include: {
          linkedPlatformAccounts: true,
          statsSnapshots: {
            where: {
              date: today,
            },
          },
        },
      });

      this.logger.log(`Creating snapshots for ${streamers.length} streamers`);

      for (const streamer of streamers) {
        for (const account of streamer.linkedPlatformAccounts) {
          // Check if snapshot already exists for today
          const existingSnapshot = streamer.statsSnapshots.find(
            snapshot => snapshot.platform === account.platform
          );

          if (existingSnapshot) {
            this.logger.log(`Snapshot already exists for ${streamer.displayName} on ${account.platform}`);
            continue;
          }

          // In a real implementation, you would fetch actual stats from platform APIs
          // For demo purposes, we'll generate some realistic mock data
          const baseFollowers = Math.floor(Math.random() * 10000) + 1000;
          const baseViews = Math.floor(Math.random() * 50000) + 5000;
          
          await this.prisma.statsSnapshot.create({
            data: {
              streamerId: streamer.id,
              platform: account.platform,
              date: today,
              followers: baseFollowers,
              views: baseViews,
              likes: Math.floor(baseViews * 0.1),
              comments: Math.floor(baseViews * 0.02),
              shares: Math.floor(baseViews * 0.005),
            },
          });
        }
      }

      this.logger.log('Daily stats snapshots created');
    } catch (error) {
      this.logger.error('Error creating stats snapshots:', error);
      throw error;
    }
  }
}