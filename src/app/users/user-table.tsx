'use client';

import { Input, Select, Skeleton, Space, Table } from 'antd';
import { ChangeEvent, useContext, useState } from 'react';

import { columns } from '@/app/users/columns';
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

  const getSkeletonColumns = () => {
    return columns.map((column) => ({
      ...column,
      render: () => {
        switch (column.key) {
          case 'rank':
            return <Skeleton.Button active size="small" />;
          case 'name':
            return (
              <div className="flex items-center space-x-4">
                <Skeleton.Avatar active size={40} />
                <div className="space-y-2">
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                </div>
              </div>
            );
          case 'followers':
            return <Skeleton.Button active size="small" />;
          case 'bio':
            return (
              <Skeleton.Input active size="small" style={{ width: 500 }} />
            );
          case 'socialLinks':
            return <Skeleton.Button active size="small" />;
          default:
            return <Skeleton.Input active size="small" />;
        }
      },
    }));
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
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">Error loading users</div>
      </div>
    );
  }

  const generateSkeletonRows = () => {
    const skeletonRows = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      skeletonRows.push({
        id: 1000000 + i,
        rank: i + 1,
        avatarUrl: '',
        url: '#',
        username: `skeleton-user-${i + 1}`,
        name: 'Skeleton User',
        followers: 0,
        following: 0,
        company: 'Skeleton Company',
        blog: '',
        bio: 'Skeleton bio',
        location: 'Skeleton Location',
        twitter: '',
      });
    }
    return skeletonRows;
  };

  return (
    <div className="flex-1">
      <Table
        className="shadow-lg"
        rowKey="id"
        title={getTitle}
        columns={
          isLoading && data.length === 0 ? getSkeletonColumns() : columns
        }
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
