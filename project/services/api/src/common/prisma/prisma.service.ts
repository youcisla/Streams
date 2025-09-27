import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

// Force use of mock client due to network restrictions and configuration issues
console.warn('API service using mock Prisma client due to network restrictions');
const mockPrisma = require('./mock-prisma');
const PrismaClient = mockPrisma.PrismaClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
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