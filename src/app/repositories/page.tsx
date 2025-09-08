'use client';

import { Radio, RadioChangeEvent, Select, Skeleton, Space, Table } from 'antd';
import { JSX, useContext, useState } from 'react';

import TopicInput from '@/app/repositories/_components/topic-input';
import { getColumns, sortOptions } from '@/app/repositories/columns';
import { MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { useTopRepos } from '@/hooks/use-github-api';
import { getLanguagesOptions, scrollToTop } from '@/utils';

import type { Sort } from '@/api/types';

export default function Repositories() {
  const languages = useContext(LanguageContext);

  const [sort, setSort] = useState<Sort>('stars');
  const [language, setLanguage] = useState<string>();
  const [topics, setTopics] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: reposData,
    isLoading,
    error,
  } = useTopRepos(currentPage, sort, language, topics);

  const data = reposData?.data || [];
  const totalCount = reposData?.totalCount || 0;

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  const getSkeletonColumns = () => {
    return getColumns(sort).map((column) => ({
      ...column,
      render: () => {
        switch (column.key) {
          case 'rank':
            return <Skeleton.Button active size="small" />;
          case 'name':
            return (
              <div className="flex items-center space-x-4">
                <Skeleton.Avatar active size={40} />
                <Skeleton.Input active size="small" style={{ width: 180 }} />
              </div>
            );
          case 'stars':
          case 'forks':
            return <Skeleton.Button active size="small" />;
          case 'description':
            return (
              <Skeleton.Input active size="small" style={{ width: 400 }} />
            );
          case 'language':
            return <Skeleton.Input active size="small" />;
          default:
            return <Skeleton.Input active size="small" />;
        }
      },
    }));
  };

  const handleCategoryChange = (e: RadioChangeEvent): void => {
    setSort(e.target.value);
    resetPage();
  };

  const handleLanguageChange = (value: string): void => {
    setLanguage(value);
    resetPage();
  };

  const getTitle = (): JSX.Element => (
    <Space className="w-full flex justify-center flex-wrap lg:justify-between">
      <Radio.Group
        options={sortOptions}
        onChange={handleCategoryChange}
        value={sort}
        optionType="button"
        buttonStyle="solid"
      />
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
            <span>Topics:</span>
            <TopicInput
              className="w-48"
              placeholder="Any"
              value={topics}
              setValue={setTopics}
              resetPage={resetPage}
            />
          </Space>
        </Space>
      </div>
    </Space>
  );

  // TODO: Add a nice error page
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">Error loading repositories</div>
      </div>
    );
  }

  const generateSkeletonRows = () => {
    const skeletonRows = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      skeletonRows.push({
        id: `skeleton-${i}`,
        rank: i + 1,
        name: `Skeleton Repo ${i + 1}`,
        url: '#',
        owner: { login: 'skeleton', avatarUrl: '', url: '#' },
        stars: 0,
        forks: 0,
        description: 'Skeleton description',
        language: 'Skeleton',
        updatedAt: new Date().toISOString(),
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
          isLoading && data.length === 0
            ? getSkeletonColumns()
            : getColumns(sort)
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
