import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import type { Repo } from '../api';
import { getTopReposAsync } from '../api';

const columns: ColumnsType<Repo> = [
  {
    title: 'Rank',
    key: 'rank',
    render: (_text, _record, index) => index + 1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name, { avatarUrl }) => (
      <div className="flex">
        <img
          className="w-6 h-6 mr-2 rounded-full"
          src={avatarUrl}
          alt="avatar"
        />
        <div className="font-medium">{name}</div>
      </div>
    ),
    width: 250,
  },
  {
    title: 'Stars',
    dataIndex: 'stars',
    key: 'stars',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 350,
  },
  {
    title: 'Language',
    key: 'language',
    dataIndex: 'language',
  },
];

const Repositories: React.FC = () => {
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopReposAsync());
      setLoading(false);
    };
    void getTopRepos();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="my-4 text-3xl flex justify-center">Top 100</div>
      <Table
        className="flex-1"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default Repositories;
