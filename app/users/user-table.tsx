'use client';

import { useContext, useState } from 'react';

import { UsersTableSkeleton } from '@/app/users/_components/loading';
import { UserRow, UserTableHead } from '@/app/users/columns';
import LanguageSelect from '@/app/repositories/_components/language-select';
import { DataTablePagination } from '@/components/data-table-pagination';
import ErrorState from '@/components/error-state';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableHeader,
} from '@/components/ui/table';
import { MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { useTopUsers } from '@/hooks/use-github-api';
import { scrollToTop } from '@/utils';

export default function UserTable({ userType }: { userType: string }) {
  const languages = useContext(LanguageContext);

  const [language, setLanguage] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: usersData,
    isLoading,
    error,
  } = useTopUsers(currentPage, userType, language, location);

  const data = usersData?.data || [];
  const totalCount = usersData?.totalCount || 0;
  const total = totalCount > MAX_DATA_COUNT ? MAX_DATA_COUNT : totalCount;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  const handleLanguageChange = (value: string | null): void => {
    setLanguage(value ?? undefined);
    resetPage();
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.value === '') {
      setLocation('');
      resetPage();
    }
  };

  const handleLocationKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') {
      setLocation(e.currentTarget.value);
      resetPage();
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    scrollToTop();
  };

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="hidden lg:flex items-center justify-end gap-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Language:</span>
          <LanguageSelect
            languages={languages}
            value={language}
            onChange={handleLanguageChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Location:</span>
          <Input
            className="w-50"
            placeholder="Any"
            onChange={handleLocationChange}
            onKeyDown={handleLocationKeyDown}
          />
        </div>
      </div>
      <div className="border rounded-none bg-card">
        <Table>
          <TableHeader>
            <UserTableHead />
          </TableHeader>
          <TableBody>
            {isLoading && data.length === 0 ? (
              <UsersTableSkeleton />
            ) : (
              data.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                  <UserRow user={user} />
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
