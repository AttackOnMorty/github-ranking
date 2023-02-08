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
            className="w-8 h-8 mr-2 rounded-full"
            src={owner.avatarUrl}
            alt="avatar"
          />
        </a>
        <a
          // className="text-blue-500"
          href={url}
          target="_black"
          rel="noreferrer"
        >
          {name}
        </a>
      </div>
    ),
    width: 300,
  },
  {
    title: 'Stars',
    dataIndex: 'stars',
    key: 'stars',
    render: (stars) => (stars >= 1000 ? `${Math.floor(stars / 1000)}k` : stars),
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Language',
    key: 'language',
    dataIndex: 'language',
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    render: (language) => language || '--',
    width: 150,
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
      <div className="my-4 text-2xl flex justify-center">Top 100</div>
      <Table
        className="flex-1"
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default Repositories;
