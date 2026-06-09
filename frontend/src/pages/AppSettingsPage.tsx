import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function AppSettingsPage() {
  return (
    <PageContainer
      title="Impostazioni app"
      description="Preferenze tecniche dell'app desktop locale."
    >
      <EmptyState
        title="Sezione Impostazioni app pronta"
        message="Le impostazioni applicative saranno implementate in un passaggio dedicato."
      />
    </PageContainer>
  )
}
