import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Processor('live-status')
export class LiveStatusProcessor {
  private readonly logger = new Logger(LiveStatusProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('check-all-streamers')
  async handleLiveStatusCheck(job: Job) {
    this.logger.log(`Processing live status check for all streamers (job ${job.id ?? 'unknown'})`);

    try {
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
        },
      });

      this.logger.log(`Found ${streamers.length} streamers to check`);

      for (const streamer of streamers) {
        for (const account of streamer.linkedPlatformAccounts) {
          // In a real implementation, you would call the platform APIs here
          const isLive = Math.random() < 0.1; // 10% chance of being live for demo
          
          await this.prisma.liveStatus.upsert({
            where: {
              streamerId_platform: {
                streamerId: streamer.id,
                platform: account.platform,
              },
            },
            update: {
              isLive,
              startedAt: isLive ? new Date() : null,
              title: isLive ? 'Live Stream!' : null,
              game: isLive ? 'Just Chatting' : null,
            },
            create: {
              streamerId: streamer.id,
              platform: account.platform,
              isLive,
              startedAt: isLive ? new Date() : null,
              title: isLive ? 'Live Stream!' : null,
              game: isLive ? 'Just Chatting' : null,
            },
          });

          // If streamer went live, send notifications (would be implemented)
          if (isLive) {
            this.logger.log(`Streamer ${streamer.displayName} is live on ${account.platform}`);
          }
        }
      }

      this.logger.log('Live status check completed');
    } catch (error) {
      this.logger.error('Error processing live status check:', error);
      throw error;
    }
  }
}