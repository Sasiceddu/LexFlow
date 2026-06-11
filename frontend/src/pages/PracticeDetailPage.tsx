import { useParams } from 'react-router-dom'
import { ApiError } from '../api/apiClient'
import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { PracticeAmountsCard } from '../features/practices/components/PracticeAmountsCard'
import { PracticeCustomDataCard } from '../features/practices/components/PracticeCustomDataCard'
import { PracticeDetailActions } from '../features/practices/components/PracticeDetailActions'
import { PracticeDetailHeader } from '../features/practices/components/PracticeDetailHeader'
import { PracticeGeneralInfoCard } from '../features/practices/components/PracticeGeneralInfoCard'
import { PracticeHistoryList } from '../features/practices/components/PracticeHistoryList'
import { PracticePeopleCard } from '../features/practices/components/PracticePeopleCard'
import { PracticeWorkflowCard } from '../features/practices/components/PracticeWorkflowCard'
import { usePracticeDetail } from '../hooks/usePracticeDetail'

export function PracticeDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <PageContainer title="Dettaglio pratica">
        <div className="practice-page-stack">
          <PracticeDetailActions />
          <EmptyState
            title="Pratica non trovata"
            message="Identificativo pratica mancante."
          />
        </div>
      </PageContainer>
    )
  }

  return <PracticeDetailContent id={id} />
}

function PracticeDetailContent({ id }: { id: string }) {
  const practiceQuery = usePracticeDetail(id)
  const practice = practiceQuery.data
  const isNotFound =
    practiceQuery.error instanceof ApiError && practiceQuery.error.status === 404

  return (
    <PageContainer
      title="Dettaglio pratica"
      description="Consulta i dati della pratica, i soggetti collegati, gli importi, lo storico e lo stato del workflow."
    >
      <div className="practice-page-stack">
        <PracticeDetailActions />

        {practiceQuery.isPending ? <LoadingSpinner label="Caricamento pratica" /> : null}

        {practiceQuery.error && !isNotFound ? (
          <ErrorMessage
            title="Pratica non disponibile"
            message={practiceQuery.error.message}
          />
        ) : null}

        {isNotFound ? (
          <EmptyState
            title="Pratica non trovata"
            message="La pratica richiesta non esiste o e stata rimossa."
          />
        ) : null}

        {practice ? (
          <>
            <PracticeDetailHeader practice={practice} />
            <div className="responsive-grid">
              <PracticeGeneralInfoCard practice={practice} />
              <PracticePeopleCard practice={practice} />
              <PracticeAmountsCard practice={practice} />
            </div>
            <PracticeWorkflowCard practice={practice} />
            <PracticeCustomDataCard customData={practice.customData} />
            <PracticeHistoryList histories={practice.histories} />
          </>
        ) : null}
      </div>
    </PageContainer>
  )
}
