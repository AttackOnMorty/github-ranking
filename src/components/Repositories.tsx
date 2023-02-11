import { Input, Select, Space, Table, Tag } from 'antd';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { getTopReposAsync } from '../api';

import type { TableProps } from 'antd';
import type { ColumnsType, FilterValue } from 'antd/es/table/interface';
import type { Repo } from '../api';

const { Search } = Input;

const categoryOptions = [
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
  const [category, setCategory] = useState('stars');
  const [language, setLanguage] = useState('');
  const [sorter, setSorter] = useState('stars');
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});

  const clearAll = (): void => {
    setFilteredInfo({});
  };

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopReposAsync(category, language));
      setSorter(category);
      clearAll();
      setLoading(false);
    };
    const id = setTimeout(() => {
      void getTopRepos();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [category, language]);

  const handleChange: TableProps<Repo>['onChange'] = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  const handleSortByChange = (value: string): void => {
    setCategory(value);
  };

  const handleLanguageSearch = (value: string, e: any): void => {
    setLanguage(value);
    e.target.blur();
  };

  return (
    <div className="flex flex-1 flex-col">
      <Space wrap className="py-10 flex justify-center" size="large">
        <Space>
          <span className="text-lg font-extralight">Sort by:</span>
          <Select
            className="w-32"
            size="large"
            defaultValue="stars"
            onChange={handleSortByChange}
            options={categoryOptions}
          />
        </Space>
        <Space>
          <span className="text-lg font-extralight">Language:</span>
          <Search
            className="w-40"
            size="large"
            placeholder="Any"
            onSearch={handleLanguageSearch}
          />
        </Space>
        <Space>
          <span className="text-lg font-extralight">Topic:</span>
          <Search className="w-40" size="large" placeholder="Any" />
        </Space>
      </Space>
      <Table
        className="shadow-lg"
        rowKey="id"
        loading={loading}
        columns={getColumns(data, sorter, filteredInfo)}
        dataSource={data}
        onChange={handleChange}
        pagination={false}
      />
    </div>
  );
};

function getColumns(
  data: Repo[],
  sorter: string,
  filteredInfo: Record<string, FilterValue | null>
): ColumnsType<Repo> {
  const languageFilters = uniq(
    data
      .map((repo) => repo.language)
      .filter((value) => value)
      .sort()
  ).map((value) => ({ text: value, value }));

  return [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { owner, url }) => (
        <div className="flex items-center">
          <a
            className="font-medium"
            href={owner.url}
            target="_black"
            rel="noreferrer"
          >
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
      title: 'Stars',
      dataIndex: 'stars',
      key: 'stars',
      sortDirections: ['descend'],
      showSorterTooltip: false,
      sorter: sorter === 'stars',
      sortOrder: sorter === 'stars' ? 'descend' : null,
      render: (stars) => (
        <span className="text-xs font-medium">
          {stars >= 1000 ? `${Math.floor(stars / 1000)}k` : stars}
        </span>
      ),
      width: 100,
    },
    {
      title: 'Forks',
      dataIndex: 'forks',
      key: 'forks',
      sortDirections: ['descend'],
      showSorterTooltip: false,
      sorter: sorter === 'forks',
      sortOrder: sorter === 'forks' ? 'descend' : null,
      render: (forks) => (
        <span className="text-xs font-medium">
          {forks >= 1000 ? `${Math.floor(forks / 1000)}k` : forks}
        </span>
      ),
      width: 100,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <span className="text-sm font-light">{description}</span>
      ),
      ellipsis: true,
    },
    {
      title: 'Language',
      key: 'language',
      dataIndex: 'language',
      filters: languageFilters,
      filteredValue: filteredInfo.language ?? null,
      filterSearch: true,
      onFilter: (value, record) => record.language === value,
      render: (language) =>
        language !== null ? (
          <Tag className="font-medium" color="rgb(14 165 233)" key={language}>
            {language}
          </Tag>
        ) : (
          <Tag className="font-medium" color="rgb(251 146 60)" key="N/A">
            N/A
          </Tag>
        ),
      width: 150,
    },
  ];
}

export default Repositories;
