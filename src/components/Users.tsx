import { Input, Radio, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getLanguagesAsync, getTopUsersAsync } from '../api';
import { ReactComponent as Company } from '../assets/company.svg';
import { ReactComponent as Location } from '../assets/location.svg';
import NyanCat from '../assets/nyan-cat.gif';
import { MAX_DATA_COUNT, PAGE_SIZE } from '../constants';
import { getLanguagesOptions, scrollToTop } from '../utils';

import type { ColumnsType } from 'antd/es/table/interface';
import type { User } from '../api';

const userTypeOptions = [
  {
    label: 'Developers',
    value: 'user',
  },
  {
    label: 'Organizations',
    value: 'org',
  },
];

const Users: React.FC = () => {
  const [userType, setUserType] = useState('user');
  const [language, setLanguage] = useState<string>();
  const [languages, setLanguages] = useState<string[]>([]);
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
    const id = setTimeout(() => {
      void getTopUsers();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [currentPage, userType, language, location]);

  useEffect(() => {
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    const id = setTimeout(() => {
      void getLanguages();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, []);

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  const handleUserTypeChange = (e: any): void => {
    setUserType(e.target.value);
    resetPage();
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
    <Space className="flex justify-center flex-wrap sm:justify-between">
      <Radio.Group
        size="large"
        options={userTypeOptions}
        onChange={handleUserTypeChange}
        value={userType}
        optionType="button"
        buttonStyle="solid"
      />
      <Space className="hidden sm:flex" size="large">
        <Space>
          <span className="text-lg font-light">Language:</span>
          <Select
            className="w-36"
            size="large"
            placeholder="Any"
            onChange={handleLanguageChange}
            options={getLanguagesOptions(languages)}
            dropdownMatchSelectWidth={200}
            showSearch
            allowClear
          />
        </Space>
        <Space>
          <span className="text-lg font-light">Location:</span>
          <Input
            className="w-36"
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
        columns={getColumns()}
        dataSource={data}
        pagination={pagination}
      />
    </div>
  );
};

function getColumns(): ColumnsType<User> {
  return [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { avatarUrl, url, username, location, company }) => (
        <div className="flex items-center">
          <img
            className="w-10 mr-4 rounded-full"
            src={avatarUrl}
            alt="avatar"
          />
          <div>
            <a
              className="text-base font-medium"
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
      ),
      width: 260,
    },
    {
      title: 'Followers',
      dataIndex: 'followers',
      key: 'followers',
      render: (followers) => (
        <span className="text-xs font-medium">
          {followers >= 1000 ? `${Math.floor(followers / 1000)}k` : followers}
        </span>
      ),
      width: 100,
      responsive: ['md'],
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      render: (bio) =>
        bio !== null ? <span className="text-sm font-light">{bio}</span> : '-',
      responsive: ['md'],
    },
    {
      title: 'Website',
      dataIndex: 'blog',
      key: 'blog',
      render: (blog: string) =>
        blog !== '' ? (
          <a
            href={blog.startsWith('http') ? blog : `https://${blog}`}
            target="_black"
            rel="noreferrer"
          >
            {blog}
          </a>
        ) : (
          '-'
        ),
      width: 240,
      ellipsis: true,
      responsive: ['md'],
    },
  ];
}

export default Users;
