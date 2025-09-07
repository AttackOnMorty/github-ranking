'use client';

import { Input, Select, Space, Table } from 'antd';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { getTopUsersAsync } from '@/api';
import { getColumns } from '@/app/users/columns';
import Loading from '@/components/loading';
import { MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { getLanguagesOptions, scrollToTop } from '@/utils';

import type { User } from '@/api/types';

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

  const getTitle = (): React.ReactElement => (
    <Space className="w-full lg:flex lg:justify-end">
      <div className="hidden lg:block">
        <Space size="large">
          <Space>
            <span>Language:</span>
            <Select
              className="w-48"
              placeholder="Any"
              onChange={handleLanguageChange}
              options={getLanguagesOptions(languages)}
              showSearch
              allowClear
            />
          </Space>
          <Space>
            <span>Location:</span>
            <Input
              className="w-48"
              placeholder="Any"
              onChange={handleLocationChange}
              onPressEnter={handleLocationPressEnter}
              allowClear
            />
          </Space>
        </Space>
      </div>
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
