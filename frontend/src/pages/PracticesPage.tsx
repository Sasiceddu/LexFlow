import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function PracticesPage() {
  return (
    <PageContainer title="Pratiche" description="Area operativa principale.">
      <EmptyState
        title="Sezione Pratiche pronta"
        message="La gestione operativa sara implementata nel prossimo passaggio."
      />
    </PageContainer>
  )
}
