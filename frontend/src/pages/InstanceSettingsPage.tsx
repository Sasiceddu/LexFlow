import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export function InstanceSettingsPage() {
  return (
    <PageContainer
      title="Impostazioni istanze"
      description="Configurazione futura di workflow, fasi e campi."
    >
      <EmptyState
        title="Sezione Impostazioni istanze pronta"
        message="La configurazione delle istanze sara implementata nel prossimo passaggio."
      />
    </PageContainer>
  )
}
