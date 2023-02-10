import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Table, Tag, Typography } from 'antd';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { getTopReposAsync } from '../api';

import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Repo } from '../api';

const Repositories: React.FC = () => {
  const [category, setCategory] = useState('Stars');
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  const languageFilters = uniq(
    data
      .map((repo) => repo.language)
      .filter((value) => value)
      .sort()
  ).map((value) => ({ text: value, value }));

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopReposAsync(category.toLowerCase()));
      setLoading(false);
    };
    const id = setTimeout(() => {
      void getTopRepos();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [category]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'Stars',
      label: 'Stars',
    },
    {
      key: 'Forks',
      label: 'Forks',
    },
  ];

  const columns: ColumnsType<Repo> = [
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
      filterSearch: true,
      onFilter: (value, record) => record.language === value,
      render: (language: string) =>
        language ? (
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

  return (
    <div className="flex flex-1 flex-col">
      <header className="py-10 flex justify-center">
        <Space>
          <span className="text-4xl font-extralight">Top 100 by</span>
          <Dropdown
            menu={{
              items: menuItems,
              selectable: true,
              defaultSelectedKeys: [category],
              onClick: (e) => {
                console.log(e);
                setCategory(e.key);
              },
            }}
          >
            <Typography.Link>
              <Space>
                <span className="text-4xl font-extralight">{category}</span>
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </Space>
      </header>
      <Table
        className="shadow-lg"
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
