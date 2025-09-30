import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { StreamPlatform, TrendingStream } from '../types/api';

export interface UseTrendingStreamsOptions {
  limit?: number;
  category?: string;
  platforms?: StreamPlatform[];
}

interface PageResponse {
  items: TrendingStream[];
  meta: {
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export const useInfiniteTrendingStreams = (options: UseTrendingStreamsOptions = {}) => {
  const { limit = 10, category, platforms } = options;

  const queryKey = [
    'trending-streams',
    {
      limit,
      category: category?.trim() || null,
      platforms: platforms?.slice().sort()?.join(',') ?? null,
    },
  ] as const;

  return useInfiniteQuery<PageResponse, Error>({
    queryKey,
    queryFn: ({ pageParam }) =>
      api.getTrendingStreams({
        limit,
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
        category,
        platforms,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined),
    select: (data) => data,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: false,
  });
};
