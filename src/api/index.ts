/* eslint-disable @typescript-eslint/naming-convention */
import { load } from 'js-yaml';
import { Octokit } from 'octokit';

import { PAGE_SIZE } from '../constants';

import type { Repos, Topic, User, Users } from './types';

// NOTE: Data would be unstable if we filter stars/forks/followers with a small number
const MIN_COUNT = 100;

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

export const getTopReposAsync = async (
  page: number,
  sort: string,
  language?: string,
  topics?: string[]
): Promise<Repos> => {
  let q = `${sort}:>${MIN_COUNT}`;

  if (language !== undefined && language.trim() !== '') {
    q += ` language:"${language}"`;
  }

  if((topics != null) && (topics.length > 0)) {
    q += topics.map(topic => ` topic:${topic}`).join('+');
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

  const data = res.data.items.map((repo: any, index: number) => ({
    id: repo.id,
    rank: (page - 1) * PAGE_SIZE + index + 1,
    name: repo.name,
    url: repo.html_url,
    owner: {
      avatarUrl: repo.owner.avatar_url,
      url: repo.owner.html_url,
    },
    stars: repo.stargazers_count,
    forks: repo.forks,
    description: repo.description,
    language: repo.language,
  }));

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
  const res = await octokit.request('GET /search/topics{?q}', {
    q: topic,
  });

  if (res.status !== 200) {
    return [];
  }

  return res.data.items.map((topic: any) => ({
    name: topic.name,
    description: topic.short_description,
  }));
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

const getUserAsync = async (username: string): Promise<User | null> => {
  const res = await octokit.request(`GET /users/${username}`);

  if (res.status !== 200) {
    return null;
  }

  const { data } = res;

  return {
    id: data.id,
    avatarUrl: data.avatar_url,
    url: data.html_url,
    username: data.username,
    name: data.name,
    followers: data.followers,
    following: data.following,
    company: data.company,
    blog: data.blog,
    bio: data.bio,
    location: data.location,
    twitter: data.twitter_username,
  };
};
