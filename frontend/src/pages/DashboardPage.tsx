import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function DashboardPage() {
  return (
    <PageContainer
      title="LexFlow"
      description="Base frontend organizzata per crescere in modo ordinato."
    >
      <EmptyState
        title="Struttura iniziale pronta"
        message="La struttura iniziale di LexFlow è pronta."
      />
    </PageContainer>
  )
}
