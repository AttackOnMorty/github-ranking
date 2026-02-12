import useSWR from 'swr';

import {
  getLanguagesAsync,
  getRepositoryInfoAsync,
  getTopReposAsync,
  getTopUsersAsync,
} from '@/api';

import type { Repos, Sort, Users } from '@/api/types';

const CACHE_DURATION = {
  ONE_DAY: 86400000, // 24 hours
  ONE_HOUR: 3600000, // 1 hour
  THIRTY_MINUTES: 1800000, // 30 minutes
} as const;

export const useTopRepos = (
  page: number,
  sort: Sort,
  language?: string,
  topics?: string[]
) => {
  const key =
    topics && topics.length > 0
      ? `top-repos-${page}-${sort}-${language || 'all'}-${topics.join(',')}`
      : `top-repos-${page}-${sort}-${language || 'all'}`;

  return useSWR<Repos>(
    key,
    () => getTopReposAsync(page, sort, language, topics),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: CACHE_DURATION.ONE_DAY,
    }
  );
};

export const useTopUsers = (
  page: number,
  type: string,
  language?: string,
  location?: string
) => {
  const key = `top-users-${page}-${type}-${language || 'all'}-${
    location || 'all'
  }`;

  return useSWR<Users>(
    key,
    () => getTopUsersAsync(page, type, language, location),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: CACHE_DURATION.ONE_DAY,
    }
  );
};

export const useLanguages = () => {
  return useSWR<string[]>('languages', getLanguagesAsync, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: CACHE_DURATION.ONE_DAY,
  });
};

export const useRepositoryInfo = (owner: string, repo: string) => {
  return useSWR(
    `repo-info-${owner}-${repo}`,
    () => getRepositoryInfoAsync(owner, repo),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: CACHE_DURATION.ONE_DAY,
    }
  );
};
