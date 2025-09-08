'use client';

import { Input, Select, Space, Table } from 'antd';
import { ChangeEvent, useContext, useState } from 'react';

import {
  UsersSkeleton,
  generateSkeletonRows,
} from '@/app/users/_components/loading';
import { columns } from '@/app/users/columns';
import ErrorState from '@/components/error-state';
import { MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { useTopUsers } from '@/hooks/use-github-api';
import { getLanguagesOptions, scrollToTop } from '@/utils';

export default function UserTable({ userType }: { userType: string }) {
  const languages = useContext(LanguageContext);

  const [language, setLanguage] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: usersData,
    isLoading,
    error,
  } = useTopUsers(currentPage, userType, language, location);

  const data = usersData?.data || [];
  const totalCount = usersData?.totalCount || 0;

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

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex-1">
      <Table
        className="shadow-lg"
        rowKey="id"
        title={getTitle}
        columns={isLoading && data.length === 0 ? UsersSkeleton() : columns}
        dataSource={
          isLoading && data.length === 0 ? generateSkeletonRows() : data
        }
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
