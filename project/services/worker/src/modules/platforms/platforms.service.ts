import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { config } from '@streamlink/config';

@Injectable()
export class PlatformsService {
  private readonly logger = new Logger(PlatformsService.name);

  // Twitch API integration
  async getTwitchUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': config.platforms.twitch.clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Twitch user info:', error);
      throw error;
    }
  }

  async getTwitchStreams(userIds: string[]) {
    try {
      const response = await axios.get(`https://api.twitch.tv/helix/streams?${userIds.map(id => `user_id=${id}`).join('&')}`, {
        headers: {
          'Client-ID': config.platforms.twitch.clientId,
          'Authorization': `Bearer ${config.platforms.twitch.clientSecret}`, // App access token
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Twitch streams:', error);
      throw error;
    }
  }

  // YouTube API integration
  async getYouTubeChannelInfo(accessToken: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet,statistics',
          mine: true,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching YouTube channel info:', error);
      throw error;
    }
  }

  // Add more platform integrations as needed...
}