import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from '@streamlink/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Worker');

  await app.listen(config.worker.port);
  
  logger.log(`[worker] Service running on port ${config.worker.port}`);
  logger.log('Scheduled jobs initialized');
}

bootstrap();