'use client';

import { Space, Table, Typography } from 'antd';

import {
  TopicsSkeleton,
  generateSkeletonRows,
} from '@/app/topics/_components/loading';
import { columns } from '@/app/topics/columns';
import ErrorState from '@/components/error-state';
import { PAGE_SIZE } from '@/constants';
import { useFeaturedTopics } from '@/hooks/use-github-api';

const { Title } = Typography;

export default function Topics() {
  const { data = [], isLoading, error } = useFeaturedTopics();

  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

  const getTitle = () => (
    <Space className="w-full flex justify-center">
      <Title level={5} className="mb-0">
        Featured
      </Title>
    </Space>
  );

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex-1">
      <Table
        className="shadow-lg"
        rowKey="name"
        title={getTitle}
        columns={
          isLoading && sortedData.length === 0 ? TopicsSkeleton() : columns
        }
        dataSource={
          isLoading && sortedData.length === 0
            ? generateSkeletonRows()
            : sortedData
        }
        pagination={{
          current: 1,
          pageSize: PAGE_SIZE,
          total: sortedData.length,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
