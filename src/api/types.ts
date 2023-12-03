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
  following: number;
  company: string | null;
  blog: string;
  bio: string;
  location: string | null;
  twitter: string | null;
}

export interface Users {
  totalCount: number;
  data: User[];
}
