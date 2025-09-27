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
  // Helper method to create mock CRUD operations for any model
  private createMockModel<T = any>() {
    return {
      findUnique: (args?: any) => Promise.resolve(null),
      findMany: (args?: any) => Promise.resolve([]),
      create: (args?: any) => Promise.resolve({} as T),
      update: (args?: any) => Promise.resolve({} as T),
      delete: (args?: any) => Promise.resolve({} as T),
      upsert: (args?: any) => Promise.resolve({} as T),
    };
  }

  user = this.createMockModel<User>();
  follow = this.createMockModel();
  linkedPlatformAccount = this.createMockModel();
  contentItem = this.createMockModel();
  statsSnapshot = this.createMockModel();
  liveStatus = this.createMockModel();
  reward = this.createMockModel();
  pointsTransaction = this.createMockModel();
  redemption = this.createMockModel();
  poll = this.createMockModel();
  pollVote = this.createMockModel();
  miniGame = this.createMockModel();
  product = this.createMockModel();
  order = this.createMockModel();

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