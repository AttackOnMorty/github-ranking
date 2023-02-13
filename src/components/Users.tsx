import { Radio, Select, Space, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getLanguagesAsync, getTopUsersAsync } from '../api';

import type { ColumnsType } from 'antd/es/table/interface';
import type { User } from '../api';

const userOptions = [
  {
    label: 'Developers',
    value: 'user',
  },
  {
    label: 'Organizations',
    value: 'org',
  },
];

const Users: React.FC = () => {
  const [type, setType] = useState('user');
  const [tableType, setTableType] = useState(type);
  const [language, setLanguage] = useState<string>();
  const [languages, setLanguages] = useState<string[]>();
  const [data, setData] = useState<User[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopUsers = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopUsersAsync(type, language));
      setLoading(false);
      setTableType(type);
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
  }, [type, language]);

  const getTitle = (): JSX.Element => (
    <div className="flex justify-between">
      <Radio.Group
        size="large"
        options={userOptions}
        onChange={(e) => {
          setType(e.target.value);
        }}
        value={type}
        optionType="button"
        buttonStyle="solid"
      />
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
      columns={getColumns(tableType)}
      dataSource={data}
      pagination={false}
    />
  );
};

function getColumns(type: string): ColumnsType<User> {
  const customizedColumns: ColumnsType<User> =
    type === 'user'
      ? [
          {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            width: 180,
            ellipsis: true,
            render: (company) => company ?? '-',
          },
          {
            title: 'Blog',
            dataIndex: 'blog',
            key: 'blog',
            render: (blog: string) =>
              blog !== '' ? (
                <a
                  href={blog.startsWith('http') ? blog : `https://${blog}`}
                  target="_black"
                  rel="noreferrer"
                >
                  {blog}
                </a>
              ) : (
                '-'
              ),
            ellipsis: true,
          },
        ]
      : [
          {
            title: 'Bio',
            dataIndex: 'bio',
            key: 'bio',
            render: (bio) =>
              bio !== null ? (
                <span className="text-sm font-light">{bio}</span>
              ) : (
                '-'
              ),
            ellipsis: true,
          },
        ];

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
          <img className="w-9 mr-4 rounded-full" src={avatarUrl} alt="avatar" />
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
      width: 240,
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
      width: 100,
    },
    ...customizedColumns,
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 180,
      render: (location) => location ?? '-',
      ellipsis: true,
    },
  ];
}

export default Users;
