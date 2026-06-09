import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function NotFoundPage() {
  return (
    <PageContainer title="Pagina non trovata">
      <EmptyState
        title="Rotta non disponibile"
        message="La sezione richiesta non esiste nella navigazione principale."
      />
    </PageContainer>
  )
}
