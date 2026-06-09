import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function TrashPage() {
  return (
    <PageContainer title="Cestino" description="Area per elementi eliminati.">
      <EmptyState
        title="Sezione Cestino pronta"
        message="Il recupero degli elementi eliminati sara implementato piu avanti."
      />
    </PageContainer>
  )
}
