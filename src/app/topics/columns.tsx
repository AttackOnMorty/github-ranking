import { EMPTY } from '@/constants';
import { convertTextToEmoji } from '@/utils';

import type { Topic } from '@/api/types';
import type { ColumnsType } from 'antd/es/table';

export const columns: ColumnsType<Topic> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name, { displayName }) => (
      <a
        className="custom-link"
        href={`https://github.com/topics/${name}`}
        target="_blank"
        rel="noreferrer"
      >
        {displayName}
      </a>
    ),
    width: 200,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (description) =>
      description !== null ? convertTextToEmoji(description) : EMPTY,
  },
];
