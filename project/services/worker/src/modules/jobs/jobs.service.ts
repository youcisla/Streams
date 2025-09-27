import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue('live-status') private liveStatusQueue: Queue,
    @InjectQueue('content-sync') private contentSyncQueue: Queue,
    @InjectQueue('stats') private statsQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleLiveStatusCheck() {
    this.logger.log('Adding live status check jobs');
    await this.liveStatusQueue.add('check-all-streamers');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleContentSync() {
    this.logger.log('Adding content sync jobs');
    await this.contentSyncQueue.add('sync-all-content');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleStatsSnapshot() {
    this.logger.log('Adding stats snapshot jobs');
    await this.statsQueue.add('create-daily-snapshots');
  }
}