import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { KickStreamProvider } from './providers/kick.provider';
import { TwitchStreamProvider } from './providers/twitch.provider';
import { YoutubeStreamProvider } from './providers/youtube.provider';
import { StreamsController } from './streams.controller';
import { STREAM_PROVIDERS_TOKEN, StreamsService } from './streams.service';

const streamProviderClasses = [
  TwitchStreamProvider,
  YoutubeStreamProvider,
  KickStreamProvider,
];

@Module({
  imports: [PrismaModule],
  controllers: [StreamsController],
  providers: [
    StreamsService,
    ...streamProviderClasses,
    {
      provide: STREAM_PROVIDERS_TOKEN,
      useFactory: (
        twitch: TwitchStreamProvider,
        youtube: YoutubeStreamProvider,
        kick: KickStreamProvider,
      ) => [twitch, youtube, kick],
      inject: streamProviderClasses,
    },
  ],
  exports: [StreamsService],
})
export class StreamsModule {}
