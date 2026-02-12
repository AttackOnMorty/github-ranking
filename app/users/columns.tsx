import { Building, MapPin } from 'lucide-react';

import { SocialLinks } from '@/components/social-links';
import { UserAvatar } from '@/components/user-avatar';
import { EMPTY } from '@/constants';
import { convertTextToEmoji, formatNumber } from '@/utils';

import type { User } from '@/api/types';

export function UserRow({ user }: { user: User }) {
  return (
    <>
      <td className="p-2 text-center w-20">{user.rank}</td>
      <td className="p-2 w-[250px]">
        <div className="flex items-center gap-3">
          <UserAvatar
            url={user.url}
            avatarUrl={user.avatarUrl}
            name={user.username}
          />
          <div>
            <a
              className="hover:underline"
              href={user.url}
              target="_blank"
              rel="noreferrer"
            >
              {user.name ?? user.username}
            </a>
            {user.company && (
              <div className="flex items-center text-muted-foreground text-[10px]">
                <Building className="mr-1 shrink-0 size-3" />
                <span>{user.company}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center text-muted-foreground text-[10px]">
                <MapPin className="mr-1 shrink-0 size-3" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="p-2 w-24 hidden md:table-cell">
        <span>{formatNumber(user.followers)}</span>
      </td>
      <td className="p-2 hidden md:table-cell">
        {user.bio ? convertTextToEmoji(user.bio) : EMPTY}
      </td>
      <td className="p-2 w-24 hidden lg:table-cell">
        <SocialLinks blog={user.blog} twitter={user.twitter} />
      </td>
    </>
  );
}

export function UserTableHead() {
  return (
    <tr className="border-b">
      <th className="p-2 text-center font-medium w-20">Rank</th>
      <th className="p-2 text-left font-medium w-[250px]">Name</th>
      <th className="p-2 text-left font-medium w-24 hidden md:table-cell">Followers</th>
      <th className="p-2 text-left font-medium hidden md:table-cell">Bio</th>
      <th className="p-2 text-left font-medium w-24 hidden lg:table-cell">Links</th>
    </tr>
  );
}
