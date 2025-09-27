import { useAuthStore } from '../store/auth';
import { 
  LoginResponse, 
  StreamerProfile, 
  Reward, 
  Redemption, 
  Follow, 
  Poll, 
  Product, 
  Order 
} from '../types/api';

const API_BASE_URL = 'http://localhost:3001/api/v1';

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Network error');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, displayName?: string, role?: 'VIEWER' | 'STREAMER' | 'BOTH'): Promise<LoginResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName, role }),
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