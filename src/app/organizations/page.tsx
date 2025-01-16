'use client';

import UserTable from '@/components/user-table';
import { USER_TYPE } from '@/constants';

export default function Users() {
  return <UserTable userType={USER_TYPE.ORGANIZATION} />;
}
