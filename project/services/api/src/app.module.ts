import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PlatformsModule } from './modules/platforms/platforms.module';
import { StreamersModule } from './modules/streamers/streamers.module';
import { StreamsModule } from './modules/streams/streams.module';
import { UsersModule } from './modules/users/users.module';
import { ViewersModule } from './modules/viewers/viewers.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

import { config } from '@streamlink/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: config.rateLimit.windowMs,
      limit: config.rateLimit.max,
    }]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    PlatformsModule,
    StreamersModule,
  StreamsModule,
    ViewersModule,
    InteractionsModule,
    MarketplaceModule,
    NotificationsModule,
    WebhooksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}