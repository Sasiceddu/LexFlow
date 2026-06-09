import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function ReportsPage() {
  return (
    <PageContainer title="Report" description="Area reportistica di LexFlow.">
      <EmptyState
        title="Sezione Report pronta"
        message="I report reali saranno implementati in un passaggio dedicato."
      />
    </PageContainer>
  )
}
