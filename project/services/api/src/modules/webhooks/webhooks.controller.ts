import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {

  @Public()
  @Post('twitch')
  @ApiOperation({ summary: 'Twitch webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  twitchWebhook(@Body() body: any, @Headers() headers: any) {
    // Handle Twitch webhooks (live status, follows, etc.)
    console.log('Twitch webhook received:', body);
    return { received: true };
  }

  @Public()
  @Post('youtube')
  @ApiOperation({ summary: 'YouTube webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  youtubeWebhook(@Body() body: any, @Headers() headers: any) {
    // Handle YouTube webhooks
    console.log('YouTube webhook received:', body);
    return { received: true };
  }

  @Public()
  @Post('kick')
  @ApiOperation({ summary: 'Kick webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  kickWebhook(@Body() body: any, @Headers() headers: any) {
    // Handle Kick webhooks
    console.log('Kick webhook received:', body);
    return { received: true };
  }
}