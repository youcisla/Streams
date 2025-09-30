import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { User } from '../types/api';

const STORAGE_KEYS = {
  token: 'auth_token',
  user: 'user',
} as const;

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (user, token) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.token, token],
      [STORAGE_KEYS.user, JSON.stringify(user)],
    ]);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.user]);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.token),
        AsyncStorage.getItem(STORAGE_KEYS.user),
      ]);

      let token: string | null = null;
      let user: User | null = null;

      if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.trim() !== '') {
        token = storedToken;
      } else if (storedToken) {
        await AsyncStorage.removeItem(STORAGE_KEYS.token);
      }

      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          user = JSON.parse(storedUser) as User;
        } catch (parseError) {
          console.warn('[AuthStore] Failed to parse stored user. Clearing persisted value.', parseError);
          await AsyncStorage.removeItem(STORAGE_KEYS.user);
        }
      } else if (storedUser) {
        await AsyncStorage.removeItem(STORAGE_KEYS.user);
      }

      set({
        user,
        token,
        isAuthenticated: Boolean(user && token),
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));