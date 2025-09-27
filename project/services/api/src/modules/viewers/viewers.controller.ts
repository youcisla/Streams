import { Controller, Get, Post, Delete, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ViewersService } from './viewers.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('viewers')
@ApiBearerAuth()
@Roles('VIEWER', 'BOTH')
@Controller('viewers')
export class ViewersController {
  constructor(private viewersService: ViewersService) {}

  @Post('follow/:streamerId')
  @ApiOperation({ summary: 'Follow a streamer' })
  @ApiResponse({ status: 201, description: 'Streamer followed successfully' })
  followStreamer(@Req() req, @Param('streamerId') streamerId: string) {
    return this.viewersService.followStreamer(req.user.id, streamerId);
  }

  @Delete('follow/:streamerId')
  @ApiOperation({ summary: 'Unfollow a streamer' })
  @ApiResponse({ status: 200, description: 'Streamer unfollowed successfully' })
  unfollowStreamer(@Req() req, @Param('streamerId') streamerId: string) {
    return this.viewersService.unfollowStreamer(req.user.id, streamerId);
  }

  @Get('following')
  @ApiOperation({ summary: 'Get followed streamers' })
  @ApiResponse({ status: 200, description: 'Following list retrieved' })
  getFollowing(@Req() req) {
    return this.viewersService.getFollowing(req.user.id);
  }

  @Post('redeem/:rewardId')
  @ApiOperation({ summary: 'Redeem a reward' })
  @ApiResponse({ status: 201, description: 'Reward redeemed successfully' })
  redeemReward(@Req() req, @Param('rewardId') rewardId: string) {
    return this.viewersService.redeemReward(req.user.id, rewardId);
  }

  @Get('redemptions')
  @ApiOperation({ summary: 'Get user redemptions' })
  @ApiResponse({ status: 200, description: 'Redemptions retrieved' })
  getRedemptions(@Req() req) {
    return this.viewersService.getRedemptions(req.user.id);
  }
}