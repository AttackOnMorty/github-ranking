/* eslint-disable @typescript-eslint/naming-convention */
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

export interface Repo {
  name: string;
  avatarUrl: string;
  stars: number;
  description: string;
  language: string;
}

export const getTopReposAsync = async (): Promise<Repo[]> => {
  const res = await octokit.request('GET /search/repositories{?q}', {
    q: 'stars:>1',
    sort: 'stars',
    per_page: 100,
  });

  if (res.status !== 200) {
    return [];
  }

  return res.data.items.map((repo: any) => {
    const {
      name,
      owner: { avatar_url },
      stargazers_count,
      description,
      language,
    } = repo;

    return {
      name,
      avatarUrl: avatar_url,
      stars: stargazers_count,
      description,
      language,
    };
  });
};
