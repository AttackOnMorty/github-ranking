import { Skeleton } from 'antd';

import { columns } from '@/app/topics/columns';
import { PAGE_SIZE } from '@/constants';

export function TopicsSkeleton() {
  const getSkeletonColumns = () => {
    return columns.map((column) => ({
      ...column,
      render: () => {
        switch (column.key) {
          case 'name':
            return (
              <Skeleton.Input active size="small" style={{ width: 120 }} />
            );
          case 'description':
            return (
              <Skeleton.Input active size="small" style={{ width: 800 }} />
            );
          default:
            return <Skeleton.Input active size="small" />;
        }
      },
    }));
  };

  return getSkeletonColumns();
}

export function generateSkeletonRows() {
  return Array.from({ length: PAGE_SIZE }, (_, index) => ({
    name: `skeleton-${index}`,
    displayName: '',
    description: '',
  }));
}
