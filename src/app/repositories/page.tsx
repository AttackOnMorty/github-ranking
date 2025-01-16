'use client';

import { Radio, RadioChangeEvent, Select, Space, Table, Tag } from 'antd';
import { nameToEmoji } from 'gemoji';
import Image from 'next/image';
import { JSX, useContext, useEffect, useState } from 'react';

import { getTopReposAsync } from '@/api';
import Loading from '@/components/loading';
import TopicInput from '@/components/topic-input';
import { EMPTY, MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { getLanguagesOptions, getTop3, scrollToTop } from '@/utils';

import type { Repo } from '@/api/types';
import type { ColumnsType } from 'antd/es/table';

const sortOptions = [
  {
    value: 'stars',
    label: 'Stars',
  },
  {
    value: 'forks',
    label: 'Forks',
  },
];

export default function Repositories() {
  const languages = useContext(LanguageContext);

  const [sort, setSort] = useState('stars');
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

function getColumns(sorter: string): ColumnsType<Repo> {
  const categoryOption = sortOptions.find((option) => option.value === sorter);

  return [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      render: (rank) => {
        const top3 = getTop3(rank);
        return top3 !== null ? <span className="text-3xl">{top3}</span> : rank;
      },
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { owner, url }) => (
        <div className="flex items-center">
          <a href={owner.url} target="_black" rel="noreferrer">
            <Image
              className="mr-4 rounded-full"
              src={owner.avatarUrl}
              width={40}
              height={40}
              alt="avatar"
            />
          </a>
          <a href={url} target="_black" rel="noreferrer">
            {name}
          </a>
        </div>
      ),
      width: 280,
    },
    {
      title: <span>{categoryOption?.label}</span>,
      dataIndex: categoryOption?.value,
      key: categoryOption?.value,
      render: (value) => (
        <div style={{ width: 35 }}>
          <span className="float-right">
            {value >= 1000 ? `${Math.floor(value / 1000)}k` : value}
          </span>
        </div>
      ),
      width: 100,
      responsive: ['md'],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) =>
        description !== null ? convertTextToEmoji(description) : EMPTY,
      responsive: ['md'],
    },
    {
      title: 'Language',
      key: 'language',
      dataIndex: 'language',
      render: (language) =>
        language !== null ? (
          <Tag color="processing" key={language} bordered={false}>
            {language}
          </Tag>
        ) : (
          <Tag color="orange" key="N/A" bordered={false}>
            N/A
          </Tag>
        ),
      width: 160,
      responsive: ['lg'],
    },
  ];
}

function convertTextToEmoji(text: string): string {
  return text.replaceAll(/:(\w+):/g, (sub, emojiText) => {
    return nameToEmoji[emojiText] === undefined ? sub : nameToEmoji[emojiText];
  });
}
