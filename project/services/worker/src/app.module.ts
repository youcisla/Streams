import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

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
export class AppModule {}