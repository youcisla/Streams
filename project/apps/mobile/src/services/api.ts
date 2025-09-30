import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { useAuthStore } from '../store/auth';
import {
    Follow,
    LoginResponse,
    Order,
    Poll,
    Product,
    Redemption,
    Reward,
    StreamerProfile,
} from '../types/api';

const API_PATH = '/api/v1';

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, '');

const resolveApiBaseUrl = (): string => {
  const envUrl =
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    process.env.EXPO_PUBLIC_API_HOST;

  if (envUrl) {
    return normalizeBaseUrl(envUrl);
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return normalizeBaseUrl(window.location.origin);
  }

  const manifestLike: Partial<typeof Constants> & {
    manifest?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  } = Constants;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    manifestLike.manifest?.debuggerHost ??
    manifestLike.manifest2?.extra?.expoClient?.hostUri ??
    '';

  if (hostUri) {
    const normalized = hostUri.startsWith('http') ? hostUri : `http://${hostUri}`;
    try {
      const url = new URL(normalized);
      const hostname = url.hostname;
      if (hostname) {
        return `http://${hostname}:3001`;
      }
    } catch {/* swallow parse errors */}
  }

  return 'http://localhost:3001';
};

const API_BASE_URL = `${resolveApiBaseUrl()}${API_PATH}`;

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { token } = useAuthStore.getState();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn('[ApiService] Network request failed', error);
      }
      throw new Error('Unable to reach the StreamLink API. Please ensure the backend server is running.');
    }

    const responseClone = response.clone();
    
    if (!response.ok) {
      let errorMessage = 'Request failed. Please try again.';

      try {
        const errorData = await responseClone.json();
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        const fallback = await responseClone.text();
        if (fallback) {
          errorMessage = fallback;
        }
      }

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    return text ? (text as unknown as T) : (undefined as T);
  }

  // Auth
  async login(payload: { loginId: string; password: string }): Promise<LoginResponse> {
    const { loginId, password } = payload;
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginId, password }),
    });
  }

  async register(payload: {
    email: string;
    password: string;
    displayName?: string;
    role?: 'VIEWER' | 'STREAMER' | 'BOTH';
    username?: string;
  }): Promise<LoginResponse> {
    const { email, password, displayName, role, username } = payload;
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName, role, username }),
    });
  }

  // Streamers
  async getStreamerProfile(streamerId: string): Promise<StreamerProfile> {
    return this.request(`/streamers/${streamerId}/profile`);
  }

  async getDashboardStats() {
    return this.request('/streamers/dashboard');
  }

  async getRewards(): Promise<Reward[]> {
    return this.request('/streamers/rewards');
  }

  async createReward(data: { title: string; description?: string; costPoints: number }): Promise<Reward> {
    return this.request('/streamers/rewards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReward(id: string, data: Partial<Reward>): Promise<Reward> {
    return this.request(`/streamers/rewards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteReward(id: string): Promise<void> {
    return this.request(`/streamers/rewards/${id}`, {
      method: 'DELETE',
    });
  }

  // Viewers
  async followStreamer(streamerId: string) {
    return this.request(`/viewers/follow/${streamerId}`, {
      method: 'POST',
    });
  }

  async unfollowStreamer(streamerId: string) {
    return this.request(`/viewers/follow/${streamerId}`, {
      method: 'DELETE',
    });
  }

  async getFollowing(): Promise<Follow[]> {
    return this.request('/viewers/following');
  }

  async redeemReward(rewardId: string): Promise<Redemption> {
    return this.request(`/viewers/redeem/${rewardId}`, {
      method: 'POST',
    });
  }

  async getRedemptions(): Promise<Redemption[]> {
    return this.request('/viewers/redemptions');
  }

  // Interactions
  async getPolls(streamerId: string, status?: 'OPEN' | 'CLOSED'): Promise<Poll[]> {
    const query = status ? `?status=${status}` : '';
    return this.request(`/interactions/polls/${streamerId}${query}`);
  }

  async votePoll(pollId: string, optionId: string) {
    return this.request(`/interactions/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    });
  }

  async createPoll(question: string, options: string[], endsAt?: string): Promise<Poll> {
    return this.request('/interactions/polls', {
      method: 'POST',
      body: JSON.stringify({ question, options, endsAt }),
    });
  }

  // Marketplace
  async getProducts(streamerId: string): Promise<Product[]> {
    return this.request(`/marketplace/products/${streamerId}?active=true`);
  }

  async createProduct(data: { title: string; description?: string; price: number }): Promise<Product> {
    return this.request('/marketplace/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createOrder(productId: string): Promise<{ order: Order; checkoutUrl: string }> {
    return this.request('/marketplace/orders', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async getOrders(role: 'buyer' | 'seller' = 'buyer'): Promise<Order[]> {
    return this.request(`/marketplace/orders?role=${role}`);
  }

  // Points
  async getPointsBalance(streamerId?: string): Promise<{ balance: number }> {
    const query = streamerId ? `?streamerId=${streamerId}` : '';
    return this.request(`/users/me/points${query}`);
  }
}

export const api = new ApiService();