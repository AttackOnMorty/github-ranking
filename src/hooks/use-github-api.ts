import {
  getLanguagesAsync,
  getTopicsAsync,
  getTopReposAsync,
  getTopUsersAsync,
} from '@/api';
import useSWR from 'swr';

import type { Repos, Sort, Topic, Users } from '@/api/types';

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
      dedupingInterval: 86400000, // 1 day
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
      dedupingInterval: 86400000, // 1 day
    }
  );
};

export const useLanguages = () => {
  return useSWR<string[]>('languages', getLanguagesAsync, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 86400000, // 1 day
  });
};

// TODO: Cache topic search
export const useTopics = (topic: string) => {
  return useSWR<Topic[]>(
    topic ? `topics-${topic}` : null,
    () => getTopicsAsync(topic),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 86400000, // 1 day
    }
  );
};
