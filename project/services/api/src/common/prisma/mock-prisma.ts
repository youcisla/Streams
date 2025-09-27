// Temporary mock Prisma client for development without database
// This allows TypeScript compilation while network issues are resolved

export enum Role {
  VIEWER = 'VIEWER',
  STREAMER = 'STREAMER',
  ADMIN = 'ADMIN',
  BOTH = 'BOTH'
}

export enum Platform {
  TWITCH = 'TWITCH',
  YOUTUBE = 'YOUTUBE',
  KICK = 'KICK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  X = 'X'
}

export enum ContentType {
  STREAM = 'STREAM',
  VIDEO = 'VIDEO',
  POST = 'POST',
  CLIP = 'CLIP',
  LIVE = 'LIVE'
}

export enum MiniGameType {
  TRIVIA = 'TRIVIA',
  POLL = 'POLL',
  PREDICTION = 'PREDICTION',
  WORD_CLOUD = 'WORD_CLOUD'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaClient {
  user = {
    findUnique: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({} as User),
    update: () => Promise.resolve({} as User),
    delete: () => Promise.resolve({} as User),
  };

  constructor() {
    console.warn('Using mock Prisma client - database operations will not work');
  }

  async $connect() {
    console.warn('Mock Prisma client - $connect called');
  }

  async $disconnect() {
    console.warn('Mock Prisma client - $disconnect called');
  }
}