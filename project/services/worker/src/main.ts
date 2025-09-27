import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from '@streamlink/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Worker');

  await app.listen(config.worker.port);
  
  logger.log(`🔧 Worker service running on port ${config.worker.port}`);
  logger.log('Scheduled jobs initialized');
}

bootstrap();