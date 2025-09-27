import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { config } from '@streamlink/config';

// Try to import real Prisma client, fallback to mock
let PrismaClient;
try {
  const prismaModule = require('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;
} catch (error) {
  console.warn('Prisma client not available, using mock client');
  const mockPrisma = require('./mock-prisma');
  PrismaClient = mockPrisma.PrismaClient;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }
}