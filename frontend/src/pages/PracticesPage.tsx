import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { ActionRow } from '../components/shared/ActionRow'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { Button } from '../components/ui/Button'
import { PracticeFiltersBar } from '../features/practices/components/PracticeFiltersBar'
import { PracticesPagination } from '../features/practices/components/PracticesPagination'
import { PracticesTable } from '../features/practices/components/PracticesTable'
import { useInstanceSettingsOverview } from '../hooks/useInstanceSettingsOverview'
import { usePractices } from '../hooks/usePractices'
import type { PracticeFilters } from '../types/practice.types'

export function PracticesPage() {
  const [filters, setFilters] = useState<PracticeFilters>({
    page: 1,
    pageSize: 20,
  })
  const practicesQuery = usePractices(filters)
  const settingsQuery = useInstanceSettingsOverview()
  const practices = practicesQuery.data?.items ?? []
  const pagination = practicesQuery.data?.pagination

  return (
    <PageContainer
      title="Pratiche"
      description="Gestisci le istanze attive, consulta lo stato delle pratiche e prepara la creazione di nuove pratiche collegate a collaboratori, professionisti e workflow."
    >
      <div className="practice-page-stack">
        <ActionRow>
          <Button disabled variant="primary">
            Nuova pratica - disponibile nel prossimo passaggio
          </Button>
        </ActionRow>

        <PracticeFiltersBar
          collaborators={settingsQuery.data?.collaborators ?? []}
          filters={filters}
          onChange={setFilters}
          phases={settingsQuery.data?.phases ?? []}
          professionals={settingsQuery.data?.professionals ?? []}
        />

        {settingsQuery.isPending ? (
          <LoadingSpinner label="Caricamento filtri pratiche" />
        ) : null}

        {settingsQuery.error ? (
          <ErrorMessage
            title="Filtri pratiche non disponibili"
            message={settingsQuery.error.message}
          />
        ) : null}

        {practicesQuery.isPending ? (
          <LoadingSpinner label="Caricamento pratiche" />
        ) : null}

        {practicesQuery.error ? (
          <ErrorMessage
            title="Pratiche non disponibili"
            message={practicesQuery.error.message}
          />
        ) : null}

        {!practicesQuery.isPending && !practicesQuery.error ? (
          <>
            <PracticesTable practices={practices} />
            {pagination ? (
              <PracticesPagination
                pagination={pagination}
                onPageChange={(page) =>
                  setFilters((current) => ({ ...current, page }))
                }
              />
            ) : null}
          </>
        ) : null}
      </div>
    </PageContainer>
  )
}
