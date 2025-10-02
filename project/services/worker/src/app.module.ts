import { BullModule } from '@nestjs/bull';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './common/prisma/prisma.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { PlatformsModule } from './modules/platforms/platforms.module';

import { config } from '@streamlink/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: config.worker.redis,
    }),
    PrismaModule,
    JobsModule,
    PlatformsModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    try {
      // Test Redis connection
      const Bull = require('bull');
      const testQueue = new Bull('connection-test', {
        redis: config.worker.redis,
      });
      
      await testQueue.isReady();
      this.logger.log('Redis connection established successfully');
      await testQueue.close();
    } catch (error) {
      this.logger.warn('Redis connection failed. Queue processing may be limited.');
      this.logger.warn(`Error: ${error.message}`);
      this.logger.log('Service will continue with limited functionality.');
    }
  }
}