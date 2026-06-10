import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { ActionRow } from '../components/shared/ActionRow'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { Button } from '../components/ui/Button'
import { CreatePracticeModal } from '../features/practices/components/CreatePracticeModal'
import { PracticeFiltersBar } from '../features/practices/components/PracticeFiltersBar'
import { PracticesPagination } from '../features/practices/components/PracticesPagination'
import { PracticesTable } from '../features/practices/components/PracticesTable'
import { useDisclosure } from '../hooks/useDisclosure'
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
  const createPracticeModal = useDisclosure()
  const practices = practicesQuery.data?.items ?? []
  const pagination = practicesQuery.data?.pagination

  return (
    <PageContainer
      title="Pratiche"
      description="Gestisci le istanze attive, consulta lo stato delle pratiche e prepara la creazione di nuove pratiche collegate a collaboratori, professionisti e workflow."
    >
      <div className="practice-page-stack">
        <ActionRow>
          <Button onClick={createPracticeModal.open} variant="primary">
            Nuova pratica
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

        <CreatePracticeModal
          collaborators={settingsQuery.data?.collaborators ?? []}
          isOpen={createPracticeModal.isOpen}
          onClose={createPracticeModal.close}
          professionals={settingsQuery.data?.professionals ?? []}
        />
      </div>
    </PageContainer>
  )
}
