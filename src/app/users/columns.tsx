import { LinkOutlined, TwitterOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import Image from 'next/image';
import { JSX } from 'react';

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
    render: (_, record) => renderSocialLinks(record),
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
    <div className="flex items-center">
      <Image
        className="mr-4 rounded-full"
        src={avatarUrl}
        width={40}
        height={40}
        alt="avatar"
      />
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

export function renderSocialLinks({
  blog,
  twitter,
}: User): JSX.Element | string {
  const blogIcon =
    blog !== '' ? (
      <a
        className="text-black"
        href={blog.startsWith('http') ? blog : `https://${blog}`}
        target="_blank"
        rel="noreferrer"
      >
        <LinkOutlined />
      </a>
    ) : null;

  const twitterIcon =
    twitter !== null ? (
      <a
        className="text-black"
        href={`https://twitter.com/${twitter}`}
        target="_blank"
        rel="noreferrer"
      >
        <TwitterOutlined />
      </a>
    ) : null;

  if (blogIcon === null && twitterIcon === null) {
    return EMPTY;
  }

  return (
    <Space>
      {blogIcon}
      {twitterIcon}
    </Space>
  );
}
