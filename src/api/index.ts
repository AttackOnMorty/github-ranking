/* eslint-disable @typescript-eslint/naming-convention */
import { load } from 'js-yaml';
import { Octokit } from 'octokit';
import { POPULAR_LANGUAGES } from '../constants';
import { PAGE_SIZE } from './../constants/index';

// TODO: Data would be unstable if we filter stars/forks/followers with a small number
const MIN_COUNT = 100;

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

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

export const getTopReposAsync = async (
  page: number,
  sort: string,
  language?: string,
  topic?: string
): Promise<Repos> => {
  let q = `${sort}:>${MIN_COUNT}`;

  if (language !== undefined && language.trim() !== '') {
    q += ` language:"${language}"`;
  }

  if (topic !== undefined && topic.trim() !== '') {
    q += ` topic:${topic}`;
  }

  const res = await octokit.request('GET /search/repositories{?q}', {
    q,
    sort,
    per_page: PAGE_SIZE,
    page,
  });

  if (res.status !== 200) {
    return { totalCount: 0, data: [] };
  }

  const data = res.data.items.map((repo: any, index: number) => {
    const {
      id,
      name,
      html_url,
      owner,
      stargazers_count,
      forks,
      description,
      language,
    } = repo;

    return {
      id,
      rank: (page - 1) * PAGE_SIZE + index + 1,
      name,
      url: html_url,
      owner: {
        avatarUrl: owner.avatar_url,
        url: owner.html_url,
      },
      stars: stargazers_count,
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
  let res;
  try {
    res = await fetch(
      'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
    );
  } catch (error) {
    return POPULAR_LANGUAGES;
  }

  if (res.status !== 200) {
    return POPULAR_LANGUAGES;
  }

  const yamlString = await res.text();
  const data = (await load(yamlString)) as object;

  return Object.keys(data);
};

export const getTopicsAsync = async (topic: string): Promise<Topic[]> => {
  const res = await octokit.request('GET /search/topics{?q}', {
    q: topic,
  });

  if (res.status !== 200) {
    return [];
  }

  return res.data.items.map((topic: any) => {
    const { name, short_description } = topic;

    return {
      name,
      description: short_description,
    };
  });
};

const getUserAsync = async (username: string): Promise<User | null> => {
  const res = await octokit.request(`GET /users/${username}`);

  if (res.status !== 200) {
    return null;
  }

  const {
    id,
    avatar_url,
    html_url,
    name,
    followers,
    company,
    blog,
    bio,
    location,
  } = res.data;

  return {
    id,
    avatarUrl: avatar_url,
    url: html_url,
    username,
    name,
    followers,
    company,
    blog,
    bio,
    location,
  };
};

export const getTopUsersAsync = async (
  page: number,
  type: string,
  language?: string,
  location?: string
): Promise<Users> => {
  let q = `type:${type} followers:>${MIN_COUNT}`;

  if (language !== undefined && language.trim() !== '') {
    q += ` language:"${language}"`;
  }

  if (location !== undefined && location.trim() !== '') {
    q += ` location:"${location}"`;
  }

  const res = await octokit.request('GET /search/users{?q}', {
    q,
    sort: 'followers',
    per_page: PAGE_SIZE,
    page,
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
};
