import { Radio, Select, Space, Table, Tag } from 'antd';
import { nameToEmoji } from 'gemoji';
import { useContext, useEffect, useState } from 'react';

import { LanguagesContext } from '../App';
import { getTopReposAsync } from '../api';
import NyanCat from '../assets/nyan-cat.gif';
import { EMPTY, MAX_DATA_COUNT, PAGE_SIZE } from '../constants';
import { getLanguagesOptions, getTop3, scrollToTop } from '../utils';
import TopicInput from './TopicInput';

import type { ColumnsType } from 'antd/es/table';
import type { Repo } from '../api/types';

function convertTextToEmoji(text: string): string {
  return text.replaceAll(/:(\w+):/g, (sub, emojiText) => {
    return nameToEmoji[emojiText] === undefined ? sub : nameToEmoji[emojiText];
  });
}

const sortOptions = [
  {
    label: <span className="font-mono">Stars</span>,
    value: 'stars',
  },
  {
    label: <span className="font-mono">Forks</span>,
    value: 'forks',
  },
];

const Repositories: React.FC = () => {
  const languages = useContext(LanguagesContext);

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
        topics,
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

  const handleCategoryChange = (e: any): void => {
    setSort(e.target.value);
    resetPage();
  };

  const handleLanguageChange = (value: string): void => {
    setLanguage(value);
    resetPage();
  };

  const getTitle = (): JSX.Element => (
    <Space className="flex justify-center flex-wrap lg:justify-between">
      <Radio.Group
        size="large"
        options={sortOptions}
        onChange={handleCategoryChange}
        value={sort}
        optionType="button"
        buttonStyle="solid"
      />
      <Space className="hidden lg:flex" size="large">
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
          <span className="text-lg font-light font-mono">Topics:</span>
          <TopicInput
            className="w-48"
            placeholder="Any"
            value={topics}
            setValue={setTopics}
            resetPage={resetPage}
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
              return <a className="font-mono">{"<"}</a>;
            }
            if (type === 'next') {
              return <a className="font-mono">{">"}</a>;
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
        columns={getColumns(tableSort)}
        dataSource={data}
        pagination={pagination}
      />
    </div>
  );
};

function getColumns(sorter: string): ColumnsType<Repo> {
  const categoryOption = sortOptions.find((option) => option.value === sorter);

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
      render: (name, { owner, url }) => (
        <div className="flex items-center">
          <a href={owner.url} target="_black" rel="noreferrer">
            <img
              className="w-10 h-10 mr-4 rounded-full"
              src={owner.avatarUrl}
              alt="avatar"
            />
          </a>
          <a
            className="font-medium font-mono"
            href={url}
            target="_black"
            rel="noreferrer"
          >
            {name}
          </a>
        </div>
      ),
      width: 280,
    },
    {
      title: <span className="font-mono">{categoryOption?.label}</span>,
      dataIndex: categoryOption?.value,
      key: categoryOption?.value,
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
    {
      title: <span className="font-mono">Description</span>,
      dataIndex: 'description',
      key: 'description',
      render: (description) =>
        description !== null ? (
          <span className="font-light font-mono">
            {convertTextToEmoji(description)}
          </span>
        ) : (
          EMPTY
        ),
      responsive: ['md'],
    },
    {
      title: <span className="font-mono">Language</span>,
      key: 'language',
      dataIndex: 'language',
      render: (language) =>
        language !== null ? (
          <Tag
            className="font-medium font-mono"
            color="processing"
            bordered={false}
            key={language}
          >
            {language}
          </Tag>
        ) : (
          <Tag
            className="font-medium font-mono"
            color="warning"
            bordered={false}
            key="N/A"
          >
            N/A
          </Tag>
        ),
      width: 160,
      responsive: ['lg'],
    },
  ];
}

export default Repositories;
