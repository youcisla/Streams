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

  private sanitizeUser(user: User & { passwordHash?: string | null }) {
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }

  async validateUser(loginId: string, password: string): Promise<User | null> {
    const trimmedLogin = loginId.trim();
    const normalizedLogin = trimmedLogin.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedLogin },
          { email: normalizedLogin },
          { username: normalizedLogin },
        ],
      },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async register(
    email: string,
    password: string,
    displayName?: string,
    role: 'VIEWER' | 'STREAMER' | 'BOTH' = 'VIEWER',
    username?: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username?.trim().toLowerCase();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(normalizedUsername ? [{ username: normalizedUsername }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
  email: normalizedEmail,
        username: normalizedUsername,
        passwordHash: hashedPassword,
        displayName,
        role,
        // Create profile based on role
        ...(role === 'STREAMER' || role === 'BOTH'
          ? {
              streamerProfile: {
                create: {
                  isPublic: true,
                },
              },
            }
          : {}),
        ...(role === 'VIEWER' || role === 'BOTH'
          ? {
              viewerProfile: {
                create: {
                  preferences: {
                    notifications: true,
                    theme: 'dark',
                  },
                },
              },
            }
          : {}),
      },
    });

    this.logger.log(`New user registered: ${email} with role ${role}`);
    return this.login(this.sanitizeUser(user));
  }

  async googleLogin(profile: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      const generatedUsername = profile.email
        ? profile.email.split('@')[0].toLowerCase()
        : undefined;
      user = await this.prisma.user.create({
        data: {
          email: profile.email?.toLowerCase(),
          username: generatedUsername,
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

    return this.login(this.sanitizeUser(user));
  }
}