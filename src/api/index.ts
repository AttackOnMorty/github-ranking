import { load } from 'js-yaml';
import { PAGE_SIZE } from '../constants';
import { GHQ } from '../utils';
import client from './client';

import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

// TODO: Data would be unstable if we filter stars/forks/followers with a small number
const MIN_COUNT = 100;

export interface Repo {
  id: string;
  rank: number;
  name: string;
  url: string;
  owner: {
    avatarUrl: string;
    url: string;
  };
  stars: number;
  forks: number;
  description: string;
  language: string;
}

export interface Repos {
  totalCount: number;
  data: Repo[];
}

export interface Topic {
  name: string;
  description: string;
}

export interface User {
  id: number;
  rank?: number;
  avatarUrl: string;
  url: string;
  username: string;
  name: string | null;
  followers: number;
  company: string | null;
  blog: string;
  bio: string;
  location: string | null;
}

export interface Users {
  totalCount: number;
  data: User[];
}

export type RepoSortOptions = Exclude<RestEndpointMethodTypes["search"]["repos"]["parameters"]["sort"], "help-wanted-issues" | "updated">

type GetTopReposParams = Pick<RestEndpointMethodTypes["search"]["repos"]["parameters"], "page"> & {
  sort: RepoSortOptions;
  language?: string;
  topic?: string;
}

export const getTopReposAsync: (params: GetTopReposParams) => Promise<Repos> = async (
  {
    page = 1,
    sort = "stars",
    language,
    topic
  }
) => {

  const res = await client.rest.search.repos({
    sort,
    per_page: PAGE_SIZE,
    page,
    q: GHQ.stringify({
      language,
      topic,
      [sort]: `>${MIN_COUNT}`,
    }),
  });

  if (res.status !== 200) {
    return { totalCount: 0, data: [] };
  }

  const data = res.data.items.map((repo: any, index: number) => {
    const {
      id,
      name,
      html_url: htmlURL,
      owner,
      stargazers_count: stargazersCount,
      forks,
      description,
      language,
    } = repo;

    return {
      id,
      rank: (page - 1) * PAGE_SIZE + index + 1,
      name,
      url: htmlURL,
      owner: {
        avatarUrl: owner.avatar_url,
        url: owner.html_url,
      },
      stars: stargazersCount,
      forks,
      description,
      language,
    };
  });

  return {
    totalCount: res.data.total_count,
    data,
  };
};

export const getLanguagesAsync = async (): Promise<string[]> => {
  const res = await fetch(
    'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
  );

  if (res.status !== 200) {
    return [];
  }

  const yamlString = await res.text();
  const data = (await load(yamlString)) as object;

  return Object.keys(data);
};

export const getTopicsAsync = async (topic: string): Promise<Topic[]> => {
  const res = await client.rest.search.topics({ q: GHQ.stringify({ topic }) });

  if (res.status !== 200) {
    return [];
  }

  return res.data.items.map((topic: any) => {
    const { name, short_description: description } = topic;

    return {
      name,
      description,
    };
  });
};

async function getUserAsync(
  username: string
): Promise<Record<string, any> | null> {
  const res = await client.rest.users.getByUsername({
    username,
  });

  if (res.status !== 200) {
    return null;
  }

  const {
    id,
    avatar_url: avatarUrl,
    html_url: url,
    name,
    followers,
    company,
    blog,
    bio,
    location,
  } = res.data;

  return {
    id,
    avatarUrl,
    url,
    username,
    name,
    followers,
    company,
    blog,
    bio,
    location,
  };
}

export async function getTopUsersAsync(
  page: number,
  type: string,
  language?: string,
  location?: string
): Promise<{
  totalCount: number;
  data: any[];
}> {
  const res = await client.rest.search.users({
    page,
    per_page: PAGE_SIZE,
    sort: 'followers',
    q: GHQ.stringify({
      type,
      followers: `>${MIN_COUNT}`,
      language,
      location,
    }),
  });

  if (res.status !== 200) {
    return { totalCount: 0, data: [] };
  }

  const usernames = res.data.items.map((user: any) => user.login);
  const users = await Promise.all(usernames.map(getUserAsync));
  const data = users.map((user, index) => ({
    ...user,
    rank: (page - 1) * PAGE_SIZE + index + 1,
  }));

  return {
    totalCount: res.data.total_count,
    data,
  };
}
