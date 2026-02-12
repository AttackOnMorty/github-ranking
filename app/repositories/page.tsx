'use client';

import { useContext, useState } from 'react';

import { RepositoriesTableSkeleton } from '@/app/repositories/_components/loading';
import LanguageSelect from '@/app/repositories/_components/language-select';
import TopicInput from '@/app/repositories/_components/topic-input';
import { RepoRow, RepoTableHead, sortOptions } from '@/app/repositories/columns';
import { DataTablePagination } from '@/components/data-table-pagination';
import ErrorState from '@/components/error-state';
import {
  Table,
  TableBody,
  TableHeader,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MAX_DATA_COUNT, PAGE_SIZE } from '@/constants';
import { LanguageContext } from '@/context/language-provider';
import { useTopRepos } from '@/hooks/use-github-api';
import { scrollToTop } from '@/utils';

import type { Sort } from '@/api/types';

export default function Repositories() {
  const languages = useContext(LanguageContext);

  const [sort, setSort] = useState<Sort>('stars');
  const [language, setLanguage] = useState<string>();
  const [topics, setTopics] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: reposData,
    isLoading,
    error,
  } = useTopRepos(currentPage, sort, language, topics);

  const data = reposData?.data || [];
  const totalCount = reposData?.totalCount || 0;
  const total = totalCount > MAX_DATA_COUNT ? MAX_DATA_COUNT : totalCount;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  const handleSortChange = (value: string): void => {
    if (value) {
      setSort(value as Sort);
      resetPage();
    }
  };

  const handleLanguageChange = (value: string | null): void => {
    setLanguage(value ?? undefined);
    resetPage();
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
      <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 py-4">
        <ToggleGroup
          type="single"
          value={sort}
          onValueChange={handleSortChange}
          variant="outline"
        >
          {sortOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.icon}
              <span>{option.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Language:</span>
            <LanguageSelect
              languages={languages}
              value={language}
              onChange={handleLanguageChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Topics:</span>
            <TopicInput
              value={topics}
              setValue={setTopics}
              resetPage={resetPage}
            />
          </div>
        </div>
      </div>
      <div className="border rounded-none bg-card">
        <Table>
          <TableHeader>
            <RepoTableHead sort={sort} />
          </TableHeader>
          <TableBody>
            {isLoading && data.length === 0 ? (
              <RepositoriesTableSkeleton />
            ) : (
              data.map((repo) => (
                <tr key={repo.id} className="border-b hover:bg-muted/50 transition-colors">
                  <RepoRow repo={repo} sort={sort} />
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
