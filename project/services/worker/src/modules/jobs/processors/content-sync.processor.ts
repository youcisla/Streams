import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Processor('content-sync')
export class ContentSyncProcessor {
  private readonly logger = new Logger(ContentSyncProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('sync-all-content')
  async handleContentSync(job: Job) {
    this.logger.log(`Processing content sync for all streamers (job ${job.id ?? 'unknown'})`);

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

      this.logger.log(`Syncing content for ${streamers.length} streamers`);

      for (const streamer of streamers) {
        for (const account of streamer.linkedPlatformAccounts) {
          // In a real implementation, you would call platform APIs here
          // For demo purposes, we'll create some mock content
          const shouldAddContent = Math.random() < 0.3; // 30% chance
          
          if (shouldAddContent) {
            await this.prisma.contentItem.create({
              data: {
                streamerId: streamer.id,
                platform: account.platform,
                platformContentId: `content_${Date.now()}_${Math.random()}`,
                type: 'VIDEO',
                title: `New ${account.platform} content from ${streamer.displayName}`,
                url: `https://${account.platform.toLowerCase()}.com/watch/demo`,
                thumbnail: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000)}/pexels-photo-${1000000 + Math.floor(Math.random() * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
                publishedAt: new Date(),
                statsCached: {
                  views: Math.floor(Math.random() * 5000),
                  likes: Math.floor(Math.random() * 500),
                  comments: Math.floor(Math.random() * 100),
                },
              },
            });
          }
        }
      }

      this.logger.log('Content sync completed');
    } catch (error) {
      this.logger.error('Error processing content sync:', error);
      throw error;
    }
  }
}