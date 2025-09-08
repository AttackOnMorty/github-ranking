import { Tag } from 'antd';

import { UserAvatar } from '@/components/user-avatar';
import { EMPTY } from '@/constants';
import { convertTextToEmoji, formatNumber, getMedalEmoji } from '@/utils';

import type { Repo } from '@/api/types';
import type { ColumnsType } from 'antd/es/table';

export const sortOptions = [
  {
    value: 'stars',
    label: 'Stars',
  },
  {
    value: 'forks',
    label: 'Forks',
  },
];

export function getColumns(sorter: string): ColumnsType<Repo> {
  const categoryOption = sortOptions.find((option) => option.value === sorter);

  return [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      render: (rank) => {
        const medalEmoji = getMedalEmoji(rank);
        return medalEmoji !== null ? (
          <span className="text-3xl">{medalEmoji}</span>
        ) : (
          rank
        );
      },
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { owner, url }) => (
        <div className="flex items-center space-x-4">
          <UserAvatar
            url={owner.url}
            avatarUrl={owner.avatarUrl}
            name={owner.login}
          />
          <a href={url} target="_blank" rel="noreferrer">
            {name}
          </a>
        </div>
      ),
      width: 280,
    },
    {
      title: <span>{categoryOption?.label}</span>,
      dataIndex: categoryOption?.value,
      key: categoryOption?.value,
      render: (value) => (
        <div style={{ width: 35 }}>
          <span className="float-right">{formatNumber(value)}</span>
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
        description !== null ? convertTextToEmoji(description) : EMPTY,
      responsive: ['md'],
    },
    {
      title: 'Language',
      key: 'language',
      dataIndex: 'language',
      render: (language) =>
        language !== null ? (
          <Tag color="processing" key={language} bordered={false}>
            {language}
          </Tag>
        ) : (
          <Tag color="orange" key="N/A" bordered={false}>
            N/A
          </Tag>
        ),
      width: 160,
      responsive: ['lg'],
    },
  ];
}
