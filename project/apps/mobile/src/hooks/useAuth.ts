import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';

export const useAuth = () => {
  const auth = useAuthStore();

  useEffect(() => {
    auth.initialize();
  }, []);

  return auth;
};