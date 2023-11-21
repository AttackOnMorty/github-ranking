import { Input, Radio, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { getLanguagesAsync, getTopReposAsync } from '../api';
import NyanCat from '../assets/nyan-cat.gif';
import { EMPTY_EMOJI, MAX_DATA_COUNT, PAGE_SIZE } from '../constants';
import { getLanguagesOptions, getTop3, scrollToTop } from '../utils';
import TopicInput from './TopicInput';

import type { ColumnsType } from 'antd/es/table/interface';
import type { Repo } from '../api';

const sortOptions = [
  {
    label: 'Stars',
    value: 'stars',
  },
  {
    label: 'Forks',
    value: 'forks',
  },
];

const Repositories: React.FC = () => {
  const [sort, setSort] = useState('stars');
  const [tableSort, setTableSort] = useState(sort);
  const [name, setName] = useState<string>();
  const [language, setLanguage] = useState<string>();
  const [languages, setLanguages] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>();
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
        name,
        language,
        topic
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
  }, [currentPage, sort, name, language, topic]);

  useEffect(() => {
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    const id = setTimeout(() => {
      void getLanguages();
    }, 300);
    return () => {
      clearTimeout(id);
    };
  }, []);

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  const handleNameChange = (e: any): void => {
    if (e.target.value === '') {
      setName('');
      resetPage();
    }
  };

  const handleNamePressEnter = (e: any): void => {
    setName(e.target.value);
    resetPage();
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
    <Space className="flex justify-center flex-wrap sm:justify-between">
      <Radio.Group
        size="large"
        options={sortOptions}
        onChange={handleCategoryChange}
        value={sort}
        optionType="button"
        buttonStyle="solid"
      />
      <Space className="hidden sm:flex" size="large">
        <Space>
          <span className="text-lg font-light">Name:</span>
          <Input
            className="w-48"
            size="large"
            placeholder="Repository name"
            onChange={handleNameChange}
            onPressEnter={handleNamePressEnter}
            allowClear
          />
        </Space>
        <Space>
          <span className="text-lg font-light">Language:</span>
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
          <span className="text-lg font-light">Topic:</span>
          <TopicInput
            className="w-48"
            placeholder="Any"
            value={topic}
            setValue={setTopic}
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
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      render: (rank) => {
        const top3 = getTop3(rank);
        return top3 !== null ? <span className="text-4xl">{top3}</span> : rank;
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
            <img
              className="w-8 mr-2 rounded-full"
              src={owner.avatarUrl}
              alt="avatar"
            />
          </a>
          <a
            className="font-medium"
            href={url}
            target="_black"
            rel="noreferrer"
          >
            {name}
          </a>
        </div>
      ),
      width: 260,
    },
    {
      title: categoryOption?.label,
      dataIndex: categoryOption?.value,
      key: categoryOption?.value,
      render: (value) => (
        <div style={{ width: 35 }}>
          <span className="font-medium float-right">
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
        description !== null ? (
          <span className="font-light">{description}</span>
        ) : (
          EMPTY_EMOJI
        ),
      responsive: ['md'],
    },
    {
      title: 'Language',
      key: 'language',
      dataIndex: 'language',
      render: (language) =>
        language !== null ? (
          <Tag className="font-medium" color="blue" key={language}>
            {language}
          </Tag>
        ) : (
          <Tag className="font-medium" color="orange" key="N/A">
            N/A
          </Tag>
        ),
      width: 160,
      responsive: ['md'],
    },
  ];
}

export default Repositories;
