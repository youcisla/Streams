import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User } from '../../prisma-client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async register(email: string, password: string, displayName?: string, role: 'VIEWER' | 'STREAMER' | 'BOTH' = 'VIEWER') {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        displayName,
        role,
        // Create profile based on role
        ...(role === 'STREAMER' || role === 'BOTH' ? {
          streamerProfile: {
            create: {
              isPublic: true,
            },
          },
        } : {}),
        ...(role === 'VIEWER' || role === 'BOTH' ? {
          viewerProfile: {
            create: {
              preferences: {
                notifications: true,
                theme: 'dark',
              },
            },
          },
        } : {}),
      },
    });

    this.logger.log(`New user registered: ${email} with role ${role}`);
    return this.login(user);
  }

  async googleLogin(profile: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          displayName: profile.displayName,
          avatarUrl: profile.picture,
          role: 'VIEWER',
          viewerProfile: {
            create: {
              preferences: {
                notifications: true,
                theme: 'dark',
              },
            },
          },
        },
      });
    }

    // Create or update OAuth account
    await this.prisma.oAuthAccount.upsert({
      where: {
        provider_providerUserId: {
          provider: 'google',
          providerUserId: profile.id,
        },
      },
      update: {
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
      },
      create: {
        userId: user.id,
        provider: 'google',
        providerUserId: profile.id,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
      },
    });

    return this.login(user);
  }
}