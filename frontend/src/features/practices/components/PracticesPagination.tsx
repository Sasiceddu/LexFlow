import { ActionRow } from '../../../components/shared/ActionRow'
import { Button } from '../../../components/ui/Button'
import type { Pagination } from '../../../types/practice.types'

type PracticesPaginationProps = {
  onPageChange: (page: number) => void
  pagination: Pagination
}

export function PracticesPagination({
  onPageChange,
  pagination,
}: PracticesPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className="practices-pagination">
      <span>
        Pagina {pagination.page} di {pagination.totalPages} -{' '}
        {pagination.total} pratiche
      </span>
      <ActionRow>
        <Button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Precedente
        </Button>
        <Button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          Successiva
        </Button>
      </ActionRow>
    </div>
  )
}
