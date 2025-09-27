import { Controller, Get, Post, Patch, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InteractionsService } from './interactions.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('interactions')
@ApiBearerAuth()
@Controller('interactions')
export class InteractionsController {
  constructor(private interactionsService: InteractionsService) {}

  // Polls
  @Roles('STREAMER', 'BOTH')
  @Post('polls')
  @ApiOperation({ summary: 'Create a poll' })
  @ApiResponse({ status: 201, description: 'Poll created successfully' })
  createPoll(@Req() req, @Body() body: { question: string; options: string[]; endsAt?: string }) {
    return this.interactionsService.createPoll(
      req.user.id,
      body.question,
      body.options,
      body.endsAt ? new Date(body.endsAt) : undefined
    );
  }

  @Get('polls/:streamerId')
  @ApiOperation({ summary: 'Get polls for a streamer' })
  @ApiResponse({ status: 200, description: 'Polls retrieved successfully' })
  getPolls(@Param('streamerId') streamerId: string, @Query('status') status?: 'OPEN' | 'CLOSED') {
    return this.interactionsService.getPolls(streamerId, status);
  }

  @Post('polls/:pollId/vote')
  @ApiOperation({ summary: 'Vote in a poll' })
  @ApiResponse({ status: 201, description: 'Vote submitted successfully' })
  votePoll(@Req() req, @Param('pollId') pollId: string, @Body() body: { optionId: string }) {
    return this.interactionsService.votePoll(req.user.id, pollId, body.optionId);
  }

  @Roles('STREAMER', 'BOTH')
  @Patch('polls/:pollId/close')
  @ApiOperation({ summary: 'Close a poll' })
  @ApiResponse({ status: 200, description: 'Poll closed successfully' })
  closePoll(@Req() req, @Param('pollId') pollId: string) {
    return this.interactionsService.closePoll(req.user.id, pollId);
  }

  // Mini Games
  @Roles('STREAMER', 'BOTH')
  @Post('games')
  @ApiOperation({ summary: 'Create a mini game' })
  @ApiResponse({ status: 201, description: 'Game created successfully' })
  createMiniGame(@Req() req, @Body() body: { type: 'TRIVIA' | 'PREDICTION' | 'QUIZ'; gameData: any; endsAt?: string }) {
    return this.interactionsService.createMiniGame(
      req.user.id,
      body.type,
      body.gameData,
      body.endsAt ? new Date(body.endsAt) : undefined
    );
  }

  @Get('games/:streamerId')
  @ApiOperation({ summary: 'Get mini games for a streamer' })
  @ApiResponse({ status: 200, description: 'Games retrieved successfully' })
  getMiniGames(@Param('streamerId') streamerId: string, @Query('type') type?: 'TRIVIA' | 'PREDICTION' | 'QUIZ') {
    return this.interactionsService.getMiniGames(streamerId, type);
  }

  @Post('games/:gameId/participate')
  @ApiOperation({ summary: 'Participate in a mini game' })
  @ApiResponse({ status: 201, description: 'Participation recorded successfully' })
  participateInGame(@Req() req, @Param('gameId') gameId: string, @Body() body: { answer: any }) {
    return this.interactionsService.participateInGame(req.user.id, gameId, body.answer);
  }
}