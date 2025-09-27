import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StreamersService } from './streamers.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('streamers')
@Controller('streamers')
export class StreamersController {
  constructor(private streamersService: StreamersService) {}

  @Public()
  @Get(':id/profile')
  @ApiOperation({ summary: 'Get public streamer profile' })
  @ApiResponse({ status: 200, description: 'Streamer profile retrieved' })
  getPublicProfile(@Param('id') id: string) {
    return this.streamersService.getPublicProfile(id);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Get('dashboard')
  @ApiOperation({ summary: 'Get streamer dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  getDashboardStats(@Req() req) {
    return this.streamersService.getDashboardStats(req.user.id);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Get('rewards')
  @ApiOperation({ summary: 'Get streamer rewards' })
  @ApiResponse({ status: 200, description: 'Rewards retrieved' })
  getRewards(@Req() req) {
    return this.streamersService.getRewards(req.user.id);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Post('rewards')
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({ status: 201, description: 'Reward created successfully' })
  createReward(@Req() req, @Body() body: { title: string; description?: string; costPoints: number }) {
    return this.streamersService.createReward(req.user.id, body);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Patch('rewards/:id')
  @ApiOperation({ summary: 'Update a reward' })
  @ApiResponse({ status: 200, description: 'Reward updated successfully' })
  updateReward(@Req() req, @Param('id') id: string, @Body() body: { title?: string; description?: string; costPoints?: number; isActive?: boolean }) {
    return this.streamersService.updateReward(req.user.id, id, body);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Delete('rewards/:id')
  @ApiOperation({ summary: 'Delete a reward' })
  @ApiResponse({ status: 200, description: 'Reward deleted successfully' })
  deleteReward(@Req() req, @Param('id') id: string) {
    return this.streamersService.deleteReward(req.user.id, id);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Get('redemptions')
  @ApiOperation({ summary: 'Get reward redemptions' })
  @ApiResponse({ status: 200, description: 'Redemptions retrieved' })
  getRedemptions(@Req() req, @Query('status') status?: 'PENDING' | 'FULFILLED' | 'REJECTED') {
    return this.streamersService.getRedemptions(req.user.id, status);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Patch('redemptions/:id')
  @ApiOperation({ summary: 'Update redemption status' })
  @ApiResponse({ status: 200, description: 'Redemption updated successfully' })
  updateRedemptionStatus(@Req() req, @Param('id') id: string, @Body() body: { status: 'FULFILLED' | 'REJECTED' }) {
    return this.streamersService.updateRedemptionStatus(req.user.id, id, body.status);
  }
}