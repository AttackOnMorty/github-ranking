import { LinkOutlined, TwitterOutlined } from '@ant-design/icons';
import { Input, Select, Space, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { LanguagesContext } from '../App';
import { getTopUsersAsync } from '../api';
import { ReactComponent as Company } from '../assets/company.svg';
import { ReactComponent as Location } from '../assets/location.svg';
import NyanCat from '../assets/nyan-cat.gif';
import { EMPTY, MAX_DATA_COUNT, PAGE_SIZE, USER_TYPE } from '../constants';
import { getLanguagesOptions, getTop3, scrollToTop } from '../utils';

import type { ColumnsType } from 'antd/es/table/interface';
import type { User } from '../api/types';

const Users: React.FC<{ userType: string }> = ({ userType }) => {
  const languages = useContext(LanguagesContext);

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
        location,
      );
      setTotalCount(totalCount);
      setData(data);
      setLoading(false);
    };
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

  const handleLocationChange = (e: any): void => {
    if (e.target.value === '') {
      setLocation('');
      resetPage();
    }
  };

  const handleLocationPressEnter = (e: any): void => {
    setLocation(e.target.value);
    resetPage();
  };

  const getTitle = (): JSX.Element => (
    <Space className="hidden lg:flex lg:justify-end">
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

  const pagination =
    totalCount <= PAGE_SIZE
      ? false
      : {
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: totalCount > MAX_DATA_COUNT ? MAX_DATA_COUNT : totalCount,
          showSizeChanger: false,
          onChange(page: number) {
            setCurrentPage(page);
            scrollToTop();
          },
          itemRender: (page: any, type: any, originalElement: any) => {
            if (type === 'prev') {
              return <a className="font-mono">{'<'}</a>;
            }
            if (type === 'next') {
              return <a className="font-mono">{'>'}</a>;
            }
            return <span className="font-mono">{originalElement}</span>;
          },
        };

  return data === undefined ? (
    <div className="flex flex-1 justify-center items-center">
      <img className="w-30 h-20" src={NyanCat} alt="loading..." />
    </div>
  ) : (
    <div className="flex-1">
      <Table
        className="shadow-lg"
        rowKey="id"
        title={getTitle}
        loading={loading}
        columns={getColumns(userType)}
        dataSource={data}
        pagination={pagination}
      />
    </div>
  );
};

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
        return top3 !== null ? <span className="text-4xl">{top3}</span> : <span className="font-mono">{rank}</span>;
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
      <img
        className="w-10 h-10 mr-4 rounded-full"
        src={avatarUrl}
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
              <div>
                <Company className="mr-1" />
              </div>
              <span>{company}</span>
            </>
          )}
        </div>
        <div className="flex items-center text-xs font-extralight">
          {location !== null && (
            <>
              <div>
                <Location className="mr-1" />
              </div>
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

export default Users;
