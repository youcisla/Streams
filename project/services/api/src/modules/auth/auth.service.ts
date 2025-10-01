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
    if (!user) {
      throw new BadRequestException('Invalid user record');
    }

    const { passwordHash, ...safeUser } = user;

    const normalizedEmail =
      typeof safeUser.email === 'string' ? safeUser.email.trim() : safeUser.email ?? '';
    const normalizedUsername =
      typeof safeUser.username === 'string' ? safeUser.username.trim() : safeUser.username ?? null;
    const normalizedDisplayName =
      typeof safeUser.displayName === 'string'
        ? safeUser.displayName.trim()
        : safeUser.displayName ?? null;

    if (!normalizedEmail) {
      this.logger.warn(`sanitizeUser invoked for user ${safeUser.id ?? 'unknown'} without email value.`);
    }

    return {
      ...safeUser,
      email: normalizedEmail,
      username: normalizedUsername,
      displayName: normalizedDisplayName,
    } as User;
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
    const sanitizedUser = this.sanitizeUser(user);
    const payload = { email: sanitizedUser.email, sub: sanitizedUser.id, role: sanitizedUser.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: sanitizedUser.id,
        email: sanitizedUser.email,
        username: sanitizedUser.username ?? undefined,
        displayName: sanitizedUser.displayName ?? undefined,
        role: sanitizedUser.role,
        avatarUrl: sanitizedUser.avatarUrl,
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
  const trimmedEmail = email.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();
  const trimmedUsername = username?.trim();
  const normalizedUsername = trimmedUsername?.toLowerCase();
  const sanitizedDisplayName = displayName?.trim();

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
  displayName: sanitizedDisplayName,
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
        ? profile.email.split('@')[0].toLowerCase().trim()
        : undefined;
      const sanitizedDisplayName = profile.displayName?.trim();
      user = await this.prisma.user.create({
        data: {
          email: profile.email?.trim().toLowerCase(),
          username: generatedUsername,
          displayName: sanitizedDisplayName,
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