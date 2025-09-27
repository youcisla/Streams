import { Module } from '@nestjs/common';
import { StreamersService } from './streamers.service';
import { StreamersController } from './streamers.controller';

@Module({
  controllers: [StreamersController],
  providers: [StreamersService],
})
export class StreamersModule {}