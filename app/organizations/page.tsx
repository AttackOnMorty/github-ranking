'use client';

import UserTable from '@/app/users/user-table';
import { USER_TYPE } from '@/constants';

export default function Organizations() {
  return <UserTable userType={USER_TYPE.ORGANIZATION} />;
}
