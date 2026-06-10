import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'
import { ExpandableCard } from '../components/ui/ExpandableCard'

export function AppSettingsPage() {
  return (
    <PageContainer
      title="Impostazioni app"
      description="Preferenze tecniche dell'app desktop locale."
    >
      <div className="expandable-section-list settings-section-list">
        <ExpandableCard
          title="Preferenze applicazione"
          description="Area pronta per le configurazioni tecniche dell'app desktop locale."
        >
          <EmptyState
            title="Sezione Impostazioni app pronta"
            message="Le impostazioni applicative saranno implementate in un passaggio dedicato."
          />
        </ExpandableCard>
      </div>
    </PageContainer>
  )
}
