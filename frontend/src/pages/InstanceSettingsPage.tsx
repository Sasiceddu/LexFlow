import { PageContainer } from '../components/layout/PageContainer'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { CollaboratorsSettingsCard } from '../features/instance-settings/components/CollaboratorsSettingsCard'
import { ConfigurableFieldsSettingsCard } from '../features/instance-settings/components/ConfigurableFieldsSettingsCard'
import { DropdownMenusSettingsCard } from '../features/instance-settings/components/DropdownMenusSettingsCard'
import { ProfessionalsSettingsCard } from '../features/instance-settings/components/ProfessionalsSettingsCard'
import { WorkflowsSettingsCard } from '../features/instance-settings/components/WorkflowsSettingsCard'
import { useInstanceSettingsOverview } from '../hooks/useInstanceSettingsOverview'

export function InstanceSettingsPage() {
  const { data, error, isPending } = useInstanceSettingsOverview()
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Impossibile caricare le impostazioni istanze.'

  return (
    <PageContainer
      title="Impostazioni istanze"
      description="Base collegata al database locale per configurare elementi operativi."
    >
      {isPending ? (
        <LoadingSpinner label="Caricamento impostazioni istanze" />
      ) : null}

      {error ? (
        <ErrorMessage
          title="Impostazioni istanze non disponibili"
          message={errorMessage}
        />
      ) : null}

      {data && !isPending && !error ? (
        <div className="expandable-section-list instance-settings-sections">
          <ProfessionalsSettingsCard />
          <CollaboratorsSettingsCard />
          <WorkflowsSettingsCard />
          <ConfigurableFieldsSettingsCard />
          <DropdownMenusSettingsCard />
        </div>
      ) : null}
    </PageContainer>
  )
}
