import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Platform } from '../../../prisma-client';
import { PrismaStreamProvider } from './prisma-stream.provider';

@Injectable()
export class TwitchStreamProvider extends PrismaStreamProvider {
  constructor(prisma: PrismaService) {
    super(prisma, Platform.TWITCH);
  }
}
