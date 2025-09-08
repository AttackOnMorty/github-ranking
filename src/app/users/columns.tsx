import { JSX } from 'react';

import { SocialLinks } from '@/components/social-links';
import { UserAvatar } from '@/components/user-avatar';
import { EMPTY } from '@/constants';
import { convertTextToEmoji, formatNumber, getMedalEmoji } from '@/utils';

import type { User } from '@/api/types';
import type { ColumnsType } from 'antd/es/table/interface';

export const columns: ColumnsType<User> = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    align: 'center',
    render: (rank) => {
      const medalEmoji = getMedalEmoji(rank);
      return medalEmoji !== null ? (
        <span className="text-3xl">{medalEmoji}</span>
      ) : (
        rank
      );
    },
    width: 70,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => renderNameColumn(record),
    width: 250,
  },
  {
    title: 'Followers',
    dataIndex: 'followers',
    key: 'followers',
    render: (value) => (
      <div style={{ width: 35 }}>
        <span className="float-right">{formatNumber(value)}</span>
      </div>
    ),
    width: 100,
    responsive: ['md'],
  },
  {
    title: 'Description',
    dataIndex: 'bio',
    key: 'bio',
    render: (bio) => (bio !== null ? convertTextToEmoji(bio) : EMPTY),
    responsive: ['md'],
  },
  {
    title: 'Links',
    dataIndex: 'socialLinks',
    key: 'socialLinks',
    render: (_, record) => (
      <SocialLinks blog={record.blog} twitter={record.twitter} />
    ),
    width: 100,
    responsive: ['lg'],
  },
];

export function renderNameColumn({
  name,
  avatarUrl,
  url,
  username,
  location,
  company,
}: User): JSX.Element {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar url={url} avatarUrl={avatarUrl} name={username} />
      <div>
        <a href={url} target="_black" rel="noreferrer">
          {name ?? username}
        </a>
        <div className="flex items-center text-xs font-extralight">
          {company !== null && (
            <>
              {/* TODO: */}
              {/* <Company className="mr-1" /> */}
              <span>{company}</span>
            </>
          )}
        </div>
        <div className="flex items-center text-xs font-extralight">
          {location !== null && (
            <>
              {/* TODO: */}
              {/* <Location className="mr-1" /> */}
              <span>{location}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
