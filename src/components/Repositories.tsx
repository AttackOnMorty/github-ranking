import { Input, Select, Space, Table, Tag } from 'antd';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { getTopReposAsync } from '../api';
import SearchInput from './SearchInput';

import type { TableProps } from 'antd';
import type { ColumnsType, FilterValue } from 'antd/es/table/interface';
import type { Repo } from '../api';

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
  const [language, setLanguage] = useState<string>();
  const [topic, setTopic] = useState<string>();
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
      setData(await getTopReposAsync(category, language, topic));
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
  }, [category, language, topic]);

  const handleChange: TableProps<Repo>['onChange'] = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Space wrap className="py-10 flex justify-center" size="large">
        <Space>
          <span className="text-lg font-extralight">Sort by:</span>
          <Select
            className="w-36"
            size="large"
            defaultValue="stars"
            onChange={(value) => {
              setCategory(value);
            }}
            options={categoryOptions}
          />
        </Space>
        <Space>
          <span className="text-lg font-extralight">Language:</span>
          <Input
            className="w-36"
            size="large"
            placeholder="Any"
            onPressEnter={(e) => {
              setLanguage(e.currentTarget.value);
            }}
            allowClear
          />
        </Space>
        <Space>
          <span className="text-lg font-extralight">Topic:</span>
          <SearchInput
            className="w-36"
            placeholder="Any"
            value={topic}
            setValue={setTopic}
          />
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
