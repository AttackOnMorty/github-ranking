import { Radio, Select, Space, Spin, Table, Tag } from 'antd';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { getLanguagesAsync, getTopReposAsync } from '../api';
import TopicInput from './TopicInput';

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
  const [sorter, setSorter] = useState('stars');
  const [tableSorter, setTableSorter] = useState(sorter);
  const [language, setLanguage] = useState<string>();
  const [languages, setLanguages] = useState<string[]>();
  const [topic, setTopic] = useState<string>();
  const [data, setData] = useState<Repo[]>();
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      await getLanguagesAsync();
      setData(await getTopReposAsync(sorter, language, topic));
      setLoading(false);
      setTableSorter(sorter);
      setFilteredInfo({});
    };
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    const id = setTimeout(() => {
      void getTopRepos();
      void getLanguages();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [sorter, language, topic]);

  const handleChange: TableProps<Repo>['onChange'] = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  const getTitle = (): JSX.Element => (
    <div className="flex justify-between">
      <Radio.Group
        size="large"
        options={categoryOptions}
        onChange={(e) => {
          setSorter(e.target.value);
        }}
        value={sorter}
        optionType="button"
        buttonStyle="solid"
      />
      <Space size="large">
        <Space>
          <span className="text-lg font-light">Language:</span>
          <Select
            className="w-36"
            size="large"
            placeholder="Any"
            onChange={(value: string) => {
              setLanguage(value);
            }}
            options={languages?.map((value) => ({
              value,
              label: value,
            }))}
            dropdownMatchSelectWidth={200}
            showSearch
            allowClear
          />
        </Space>
        <Space>
          <span className="text-lg font-light">Topic:</span>
          <TopicInput
            className="w-36"
            placeholder="Any"
            value={topic}
            setValue={setTopic}
          />
        </Space>
      </Space>
    </div>
  );

  return (
    <div className="max-w-6xl px-10 py-6 flex flex-1">
      {data === undefined ? (
        <div className="flex flex-1 justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex-1">
          <Table
            className="shadow-lg"
            rowKey="id"
            title={getTitle}
            loading={loading}
            columns={getColumns(data, tableSorter, filteredInfo)}
            dataSource={data}
            onChange={handleChange}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

function getColumns(
  data: Repo[],
  sorter: string,
  filteredInfo: Record<string, FilterValue | null>
): ColumnsType<Repo> {
  const categoryOption = categoryOptions.find(
    (option) => option.value === sorter
  );
  const languageFilters = uniq(
    data
      .map((repo) => repo.language)
      .filter((value) => value)
      .sort()
  ).map((value) => ({ text: value, value }));

  languageFilters.unshift({ text: 'N/A', value: '' });

  return [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
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
        <span className="text-xs font-medium">
          {value >= 1000 ? `${Math.floor(value / 1000)}k` : value}
        </span>
      ),
      width: 80,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) =>
        description !== null ? (
          <span className="font-light">{description}</span>
        ) : (
          '-'
        ),
    },
    {
      title: 'Language',
      key: 'language',
      dataIndex: 'language',
      filters: languageFilters,
      filteredValue: filteredInfo.language ?? null,
      filterSearch: true,
      onFilter: (value, record) =>
        value === '' ? record.language === null : record.language === value,
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
      width: 160,
    },
  ];
}

export default Repositories;
