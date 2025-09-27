import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  // Polls
  async createPoll(streamerId: string, question: string, options: string[], endsAt?: Date) {
    return this.prisma.poll.create({
      data: {
        streamerId,
        question,
        endsAt,
        options: {
          create: options.map(label => ({ label })),
        },
      },
      include: {
        options: true,
      },
    });
  }

  async getPolls(streamerId: string, status?: 'OPEN' | 'CLOSED') {
    return this.prisma.poll.findMany({
      where: {
        streamerId,
        ...(status ? { status } : {}),
      },
      include: {
        options: true,
        votes: {
          include: {
            user: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async votePoll(userId: string, pollId: string, optionId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.status === 'CLOSED') {
      throw new BadRequestException('Poll is closed');
    }

    if (poll.endsAt && poll.endsAt < new Date()) {
      throw new BadRequestException('Poll has ended');
    }

    const option = poll.options.find(o => o.id === optionId);
    if (!option) {
      throw new NotFoundException('Poll option not found');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Create vote
      const vote = await prisma.pollVote.upsert({
        where: {
          pollId_userId: {
            pollId,
            userId,
          },
        },
        update: {
          optionId,
        },
        create: {
          pollId,
          optionId,
          userId,
        },
      });

      // Update option vote count
      await prisma.pollOption.update({
        where: { id: optionId },
        data: {
          votes: {
            increment: 1,
          },
        },
      });

      return vote;
    });
  }

  async closePoll(streamerId: string, pollId: string) {
    const poll = await this.prisma.poll.findFirst({
      where: {
        id: pollId,
        streamerId,
      },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    return this.prisma.poll.update({
      where: { id: pollId },
      data: { status: 'CLOSED' },
      include: {
        options: true,
        votes: true,
      },
    });
  }

  // Mini Games
  async createMiniGame(streamerId: string, type: 'TRIVIA' | 'PREDICTION' | 'QUIZ', gameData: any, endsAt?: Date) {
    return this.prisma.miniGame.create({
      data: {
        streamerId,
        type,
        state: gameData,
        endsAt,
      },
    });
  }

  async getMiniGames(streamerId: string, type?: 'TRIVIA' | 'PREDICTION' | 'QUIZ') {
    return this.prisma.miniGame.findMany({
      where: {
        streamerId,
        ...(type ? { type } : {}),
      },
      include: {
        participations: {
          include: {
            user: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async participateInGame(userId: string, gameId: string, answer: any) {
    const game = await this.prisma.miniGame.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.endsAt && game.endsAt < new Date()) {
      throw new BadRequestException('Game has ended');
    }

    return this.prisma.gameParticipation.upsert({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
      update: {
        answer,
      },
      create: {
        gameId,
        userId,
        answer,
      },
    });
  }
}