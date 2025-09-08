'use client';

import { Radio, RadioChangeEvent, Select, Space, Table } from 'antd';
import { JSX, useContext, useEffect, useState } from 'react';

import { getTopReposAsync } from '@/api';
import TopicInput from '@/app/repositories/_components/topic-input';
import { getColumns, sortOptions } from '@/app/repositories/columns';
import Loading from '@/components/loading';
import { MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { getLanguagesOptions, scrollToTop } from '@/utils';

import type { Repo, Sort } from '@/api/types';

export default function Repositories() {
  const languages = useContext(LanguageContext);

  const [sort, setSort] = useState<Sort>('stars');
  const [tableSort, setTableSort] = useState(sort);
  const [language, setLanguage] = useState<string>();
  const [topics, setTopics] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [data, setData] = useState<Repo[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      const { totalCount, data } = await getTopReposAsync(
        currentPage,
        sort,
        language,
        topics
      );
      setTotalCount(totalCount);
      setData(data);
      setLoading(false);
      setTableSort(sort);
    };
    const id = setTimeout(() => {
      void getTopRepos();
    }, 300);
    return () => {
      clearTimeout(id);
    };
  }, [currentPage, sort, language, topics]);

  const resetPage = (): void => {
    setCurrentPage(1);
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

  return data === undefined ? (
    <Loading />
  ) : (
    <div className="flex-1">
      <Table
        className="shadow-lg"
        rowKey="id"
        title={getTitle}
        loading={loading}
        columns={getColumns(tableSort)}
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
