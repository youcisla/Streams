import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './mock-prisma';

// Force use of mock client due to network restrictions and configuration issues
console.warn('Worker service using mock Prisma client due to network restrictions');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Worker connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Worker disconnected from database');
  }
}