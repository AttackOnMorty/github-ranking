import { Radio, Table, Tag } from 'antd';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { getTopReposAsync } from '../api';

import type { TableProps } from 'antd';
import type {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/es/table/interface';
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
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Repo>>({});

  const clearAll = (): void => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopReposAsync(category));
      clearAll();
      setLoading(false);
    };
    const id = setTimeout(() => {
      void getTopRepos();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [category]);

  const handleChange: TableProps<Repo>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Repo>);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="py-10 flex justify-center">
        <Radio.Group
          size="large"
          optionType="button"
          buttonStyle="solid"
          defaultValue="stars"
          options={categoryOptions}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        />
      </div>
      <Table
        className="shadow-lg"
        rowKey="id"
        loading={loading}
        columns={getColumns(data, sortedInfo, filteredInfo)}
        dataSource={data}
        onChange={handleChange}
        pagination={false}
      />
    </div>
  );
};

function getColumns(
  data: Repo[],
  sortedInfo: SorterResult<Repo>,
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
      sortDirections: ['descend', 'ascend'],
      sorter: (repo1, repo2) => repo1.stars - repo2.stars,
      sortOrder: sortedInfo.columnKey === 'stars' ? sortedInfo.order : null,
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
      sortDirections: ['descend', 'ascend'],
      sorter: (repo1, repo2) => repo1.forks - repo2.forks,
      sortOrder: sortedInfo.columnKey === 'forks' ? sortedInfo.order : null,
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
