import { Select, Space, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getLanguagesAsync, getTopUsersAsync } from '../api';

import type { ColumnsType } from 'antd/es/table/interface';
import type { User } from '../api';

const Repositories: React.FC = () => {
  const [language, setLanguage] = useState<string>();
  const [languages, setLanguages] = useState<string[]>();
  const [data, setData] = useState<User[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopUsers = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopUsersAsync(language));
      setLoading(false);
    };
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    const id = setTimeout(() => {
      void getTopUsers();
      void getLanguages();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [language]);

  const getTitle = (): JSX.Element => (
    <div className="flex justify-end">
      <Space>
        <span className="text-lg font-extralight">Language:</span>
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
    </div>
  );

  return data === undefined ? (
    <div className="flex items-center">
      <Spin size="large" />
    </div>
  ) : (
    <Table
      className="shadow-lg"
      rowKey="id"
      title={getTitle}
      loading={loading}
      columns={getColumns()}
      dataSource={data}
      pagination={false}
    />
  );
};

function getColumns(): ColumnsType<User> {
  return [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      render: (_text, _record, index) => index + 1,
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { username, avatarUrl, url }) => (
        <div className="flex items-center">
          <img className="w-8 mr-2 rounded-full" src={avatarUrl} alt="avatar" />
          <a
            className="font-medium"
            href={url}
            target="_black"
            rel="noreferrer"
          >
            {name ?? username}
          </a>
        </div>
      ),
      width: 260,
    },
    {
      title: 'Followers',
      dataIndex: 'followers',
      key: 'followers',
      render: (followers) => (
        <span className="text-xs font-medium">
          {followers >= 1000 ? `${Math.floor(followers / 1000)}k` : followers}
        </span>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      width: '30%',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
  ];
}

export default Repositories;
