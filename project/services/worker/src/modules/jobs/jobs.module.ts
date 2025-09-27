import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { LiveStatusProcessor } from './processors/live-status.processor';
import { ContentSyncProcessor } from './processors/content-sync.processor';
import { StatsProcessor } from './processors/stats.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'live-status' },
      { name: 'content-sync' },
      { name: 'stats' },
    ),
  ],
  providers: [JobsService, LiveStatusProcessor, ContentSyncProcessor, StatsProcessor],
  exports: [JobsService],
})
export class JobsModule {}