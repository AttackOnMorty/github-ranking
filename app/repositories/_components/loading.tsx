import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_SIZE } from '@/constants';

export function RepositoriesTableSkeleton() {
  return Array.from({ length: PAGE_SIZE }, (_, i) => (
    <tr key={`skeleton-${i}`} className="border-b">
      <td className="p-2 text-center">
        <Skeleton className="h-4 w-8 mx-auto" />
      </td>
      <td className="p-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
      </td>
      <td className="p-2 hidden md:table-cell">
        <Skeleton className="h-4 w-12" />
      </td>
      <td className="p-2 hidden md:table-cell">
        <Skeleton className="h-4 w-96" />
      </td>
      <td className="p-2 hidden lg:table-cell">
        <Skeleton className="h-5 w-20" />
      </td>
    </tr>
  ));
}
