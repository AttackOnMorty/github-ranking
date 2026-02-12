import { GitFork, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/user-avatar';
import { EMPTY } from '@/constants';
import { convertTextToEmoji, formatNumber } from '@/utils';

import type { Repo, Sort } from '@/api/types';

export const sortOptions: { value: Sort; label: string; icon: React.ReactNode }[] = [
  {
    value: 'stars',
    label: 'Stars',
    icon: <Star className="size-4" />,
  },
  {
    value: 'forks',
    label: 'Forks',
    icon: <GitFork className="size-4" />,
  },
];

export function RepoRow({ repo, sort }: { repo: Repo; sort: Sort }) {
  const countValue = sort === 'stars' ? repo.stars : repo.forks;

  return (
    <>
      <td className="p-2 text-center w-20">{repo.rank}</td>
      <td className="p-2 w-[280px]">
        <div className="flex items-center gap-3">
          <UserAvatar
            url={repo.owner.url}
            avatarUrl={repo.owner.avatarUrl}
            name={repo.owner.login}
          />
          <a
            className="hover:underline"
            href={repo.url}
            target="_blank"
            rel="noreferrer"
          >
            {repo.name}
          </a>
        </div>
      </td>
      <td className="p-2 w-24 hidden md:table-cell">
        <span>{formatNumber(countValue)}</span>
      </td>
      <td className="p-2 hidden md:table-cell">
        {repo.description ? convertTextToEmoji(repo.description) : EMPTY}
      </td>
      <td className="p-2 w-40 hidden lg:table-cell">
        <Badge variant="secondary">{repo.language ?? EMPTY}</Badge>
      </td>
    </>
  );
}

export function RepoTableHead({ sort }: { sort: Sort }) {
  const sortOption = sortOptions.find((opt) => opt.value === sort);

  return (
    <tr className="border-b">
      <th className="p-2 text-center font-medium w-20">Rank</th>
      <th className="p-2 text-left font-medium w-[280px]">Name</th>
      <th className="p-2 text-left font-medium w-24 hidden md:table-cell">{sortOption?.label}</th>
      <th className="p-2 text-left font-medium hidden md:table-cell">Description</th>
      <th className="p-2 text-left font-medium w-40 hidden lg:table-cell">Language</th>
    </tr>
  );
}
