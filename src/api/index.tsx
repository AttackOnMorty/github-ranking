/* eslint-disable @typescript-eslint/naming-convention */
import { load } from 'js-yaml';
import { Octokit } from 'octokit';

// TODO: Data would be unstable if we filter stars/forks/followers with a small number
const MIN_STARS_OR_FORKS = 100;
const MIN_FOLLOWERS = 100;
const PER_PAGE = 100;

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

export interface Topic {
  name: string;
  description: string;
}

export interface User {
  id: number;
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

export const getTopReposAsync = async (
  sorter: string,
  language?: string,
  topic?: string
): Promise<Repo[]> => {
  let q = `${sorter}:>${MIN_STARS_OR_FORKS}`;

  if (language !== undefined && language.trim() !== '') {
    q += ` language:"${language}"`;
  }

  if (topic !== undefined && topic.trim() !== '') {
    q += ` topic:${topic}`;
  }

  const res = await octokit.request('GET /search/repositories{?q}', {
    q,
    sort: sorter,
    per_page: PER_PAGE,
  });

  if (res.status !== 200) {
    return [];
  }

  return res.data.items.map((repo: any, index: number) => {
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
      rank: index + 1,
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
};

export const getLanguagesAsync = async (): Promise<string[]> => {
  const res = await fetch(
    'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
  );
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

  return res.data.items.map((topic: any, index: number) => {
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
  type: string,
  language?: string
): Promise<User[]> => {
  let q = `type:${type} followers:>${MIN_FOLLOWERS}`;

  if (language !== undefined && language.trim() !== '') {
    q += ` language:"${language}"`;
  }

  const res = await octokit.request('GET /search/users{?q}', {
    q,
    sort: 'followers',
    per_page: PER_PAGE,
  });

  if (res.status !== 200) {
    return [];
  }

  const usernames = res.data.items.map((user: any) => user.login);

  return await Promise.all(usernames.map(getUserAsync));
};
