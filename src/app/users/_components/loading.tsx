import { Skeleton } from 'antd';

import { columns } from '@/app/users/columns';
import { PAGE_SIZE } from '@/constants';

export function UsersSkeleton() {
  const getSkeletonColumns = () => {
    return columns.map((column) => ({
      ...column,
      render: () => {
        switch (column.key) {
          case 'rank':
            return <Skeleton.Button active size="small" />;
          case 'name':
            return (
              <div className="flex items-center space-x-4">
                <Skeleton.Avatar active size={40} />
                <div className="space-y-2">
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                </div>
              </div>
            );
          case 'followers':
            return <Skeleton.Button active size="small" />;
          case 'bio':
            return (
              <Skeleton.Input active size="small" style={{ width: 500 }} />
            );
          case 'socialLinks':
            return <Skeleton.Button active size="small" />;
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
      id: 1000000 + i,
      rank: i + 1,
      avatarUrl: '',
      url: '#',
      username: `skeleton-user-${i + 1}`,
      name: 'Skeleton User',
      followers: 0,
      following: 0,
      company: 'Skeleton Company',
      blog: '',
      bio: 'Skeleton bio',
      location: 'Skeleton Location',
      twitter: '',
    });
  }
  return skeletonRows;
}
