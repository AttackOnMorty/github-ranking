import { Skeleton } from 'antd';

import { getColumns } from '@/app/repositories/columns';
import { PAGE_SIZE } from '@/constants';

import type { Sort } from '@/api/types';

interface RepositoriesSkeletonProps {
  sort: Sort;
}

export function RepositoriesSkeleton({ sort }: RepositoriesSkeletonProps) {
  const getSkeletonColumns = () => {
    return getColumns(sort).map((column) => ({
      ...column,
      render: () => {
        switch (column.key) {
          case 'rank':
            return <Skeleton.Button active size="small" />;
          case 'name':
            return (
              <div className="flex items-center space-x-4">
                <Skeleton.Avatar active size={40} />
                <Skeleton.Input active size="small" style={{ width: 180 }} />
              </div>
            );
          case 'stars':
          case 'forks':
            return <Skeleton.Button active size="small" />;
          case 'description':
            return (
              <Skeleton.Input active size="small" style={{ width: 400 }} />
            );
          case 'language':
            return <Skeleton.Input active size="small" />;
          default:
            return <Skeleton.Input active size="small" />;
        }
      },
    }));
  };

  return getSkeletonColumns();
}

export function generateSkeletonRows() {
  const skeletonRows = [];
  for (let i = 0; i < PAGE_SIZE; i++) {
    skeletonRows.push({
      id: `skeleton-${i}`,
      rank: i + 1,
      name: `Skeleton Repo ${i + 1}`,
      url: '#',
      owner: { login: 'skeleton', avatarUrl: '', url: '#' },
      stars: 0,
      forks: 0,
      description: 'Skeleton description',
      language: 'Skeleton',
      updatedAt: new Date().toISOString(),
    });
  }
  return skeletonRows;
}
