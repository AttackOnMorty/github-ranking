'use client';

import { LinkOutlined, TwitterOutlined } from '@ant-design/icons';
import { Input, Select, Space, Table } from 'antd';
import Image from 'next/image';
import { ChangeEvent, JSX, useContext, useEffect, useState } from 'react';

import { getTopUsersAsync } from '@/api';
import Loading from '@/components/loading';
import { EMPTY, MAX_DATA_COUNT, PAGE_SIZE, USER_TYPE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { getLanguagesOptions, getTop3, scrollToTop } from '@/utils';

import type { User } from '@/api/types';
import type { ColumnsType } from 'antd/es/table/interface';

export default function UserTable({ userType }: { userType: string }) {
  const languages = useContext(LanguageContext);

  const [language, setLanguage] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [data, setData] = useState<User[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopUsers = async (): Promise<void> => {
      setLoading(true);
      const { totalCount, data } = await getTopUsersAsync(
        currentPage,
        userType,
        language,
        location
      );
      setTotalCount(totalCount);
      setData(data);
      setLoading(false);
    };
    // TODO: why setTimeout?
    const id = setTimeout(() => {
      void getTopUsers();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [currentPage, userType, language, location]);

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  const handleLanguageChange = (value: string): void => {
    setLanguage(value);
    resetPage();
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === '') {
      setLocation('');
      resetPage();
    }
  };

  const handleLocationPressEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    setLocation(e.currentTarget.value);
    resetPage();
  };

  const getTitle = (): JSX.Element => (
    <Space className="w-full lg:flex lg:justify-end">
      <Space size="large">
        <Space>
          <span className="text-lg font-light font-mono">Language:</span>
          <Select
            className="w-48"
            size="large"
            placeholder="Any"
            onChange={handleLanguageChange}
            options={getLanguagesOptions(languages)}
            showSearch
            allowClear
          />
        </Space>
        <Space>
          <span className="text-lg font-light font-mono">Location:</span>
          <Input
            className="w-48"
            size="large"
            placeholder="Any"
            onChange={handleLocationChange}
            onPressEnter={handleLocationPressEnter}
            allowClear
          />
        </Space>
      </Space>
    </Space>
  );

  return data === undefined ? (
    <Loading />
  ) : (
    <div className="flex-1">
      <Table
        className="shadow-lg"
        rowKey="id"
        title={getTitle}
        loading={loading}
        columns={getColumns(userType)}
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: totalCount > MAX_DATA_COUNT ? MAX_DATA_COUNT : totalCount,
          showSizeChanger: false,
          onChange(page: number) {
            setCurrentPage(page);
            scrollToTop();
          },
        }}
      />
    </div>
  );
}

function getColumns(userType: string): ColumnsType<User> {
  const followingColumn: ColumnsType<User> = [
    {
      title: <span className="font-mono">Following</span>,
      dataIndex: 'following',
      key: 'followers',
      render: (value: number, { username }: User) => {
        const url = `https://github.com/${username}?tab=following`;
        return (
          <div style={{ width: 35 }}>
            <a
              href={url}
              target="_black"
              className="text-black font-medium float-right font-mono"
            >
              {value >= 1000 ? `${Math.floor(value / 1000)}k` : value}
            </a>
          </div>
        );
      },
      width: 100,
      responsive: ['lg'],
    },
  ];

  return [
    {
      title: <span className="font-mono">Rank</span>,
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      render: (rank) => {
        const top3 = getTop3(rank);
        return top3 !== null ? (
          <span className="text-4xl">{top3}</span>
        ) : (
          <span className="font-mono">{rank}</span>
        );
      },
      width: 70,
    },
    {
      title: <span className="font-mono">Name</span>,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => renderNameColumn(record),
      width: 250,
    },
    {
      title: <span className="font-mono">Followers</span>,
      dataIndex: 'followers',
      key: 'followers',
      render: (value) => (
        <div style={{ width: 35 }}>
          <span className="font-medium float-right font-mono">
            {value >= 1000 ? `${Math.floor(value / 1000)}k` : value}
          </span>
        </div>
      ),
      width: 100,
      responsive: ['md'],
    },
    ...(userType === USER_TYPE.USER ? followingColumn : []),
    {
      title: <span className="font-mono">Description</span>,
      dataIndex: 'bio',
      key: 'bio',
      render: (bio) =>
        bio !== null ? (
          <span className="font-light font-mono">{bio}</span>
        ) : (
          EMPTY
        ),
      responsive: ['md'],
    },
    {
      title: <span className="font-mono">Links</span>,
      dataIndex: 'socialLinks',
      key: 'socialLinks',
      render: (_, record) => renderSocialLinks(record),
      width: 100,
      responsive: ['lg'],
    },
  ];
}

function renderNameColumn({
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
        <a
          className="font-medium font-mono"
          href={url}
          target="_black"
          rel="noreferrer"
        >
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

function renderSocialLinks({ blog, twitter }: User): JSX.Element | string {
  const blogIcon =
    blog !== '' ? (
      <a
        className="text-black"
        href={blog.startsWith('http') ? blog : `https://${blog}`}
        target="_black"
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
        target="_black"
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
