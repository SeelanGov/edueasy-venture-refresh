import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TrainingFooterProps {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

/**
 * TrainingFooter
 * @description Function
 */
export const TrainingFooter = ({ page, setPage, hasMore }: TrainingFooterProps) => {
  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 0 && setPage(page - 1)}
              className={page === 0 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2">{page + 1}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => hasMore && setPage(page + 1)}
              className={!hasMore ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
