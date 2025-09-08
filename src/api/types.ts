export type Sort = 'stars' | 'forks';

export interface Repo {
  id: string;
  rank: number;
  name: string;
  url: string;
  owner: {
    login: string | undefined;
    avatarUrl: string | undefined;
    url: string | undefined;
  };
  stars: number;
  forks: number;
  description: string | null;
  language: string | null;
}

export interface Repos {
  totalCount: number;
  data: Repo[];
}

export interface Topic {
  name: string;
  description: string | null;
}

export interface User {
  id: number;
  rank?: number;
  avatarUrl: string | undefined;
  url: string | undefined;
  username: string;
  name: string | null;
  followers: number;
  following: number;
  company: string | null;
  blog: string | null;
  bio: string | null;
  location: string | null;
  twitter: string | null | undefined;
}

export interface Users {
  totalCount: number;
  data: User[];
}
