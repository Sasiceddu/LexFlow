import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { SectionList } from '../components/shared/SectionList'
import { ExpandableCard } from '../components/ui/ExpandableCard'
import { CollaboratorsSettingsCard } from '../features/instance-settings/components/CollaboratorsSettingsCard'
import { DropdownMenusSettingsCard } from '../features/instance-settings/components/DropdownMenusSettingsCard'
import { ProfessionalsSettingsCard } from '../features/instance-settings/components/ProfessionalsSettingsCard'
import { useInstanceSettingsOverview } from '../hooks/useInstanceSettingsOverview'
import type {
  InstanceSettingsOverview,
  WorkflowOverviewItem,
} from '../types/instanceSettings.types'
import { formatPluralCount, joinCountParts } from '../utils/formatCount'

function getFirstItems(items: string[], limit = 5): string[] {
  return items.slice(0, limit)
}

function getWorkflowSummary(
  workflow: WorkflowOverviewItem,
  overview: InstanceSettingsOverview,
): string {
  const phases = overview.phases.filter((phase) => phase.workflowId === workflow.id)
  const initialPhase = phases.find((phase) => phase.isInitial)
  const finalPhases = phases.filter((phase) => phase.isFinal)
  const transitions = overview.transitions.filter(
    (transition) => transition.workflowId === workflow.id,
  )

  return [
    workflow.name,
    initialPhase ? `iniziale: ${initialPhase.name}` : 'iniziale: non definita',
    finalPhases.length > 0
      ? `finali: ${finalPhases.map((phase) => phase.name).join(', ')}`
      : 'finali: non definite',
    `${phases.length} fasi`,
    `${transitions.length} transizioni`,
  ].join(' - ')
}

function getTransitionItems(
  workflow: WorkflowOverviewItem,
  overview: InstanceSettingsOverview,
): string[] {
  const transitions = overview.transitions.filter(
    (transition) => transition.workflowId === workflow.id,
  )
  const visibleTransitions = transitions
    .slice(0, 6)
    .map(
      (transition) =>
        `${transition.actionLabel}: ${transition.fromPhase.name} -> ${transition.toPhase.name}`,
    )
  const hiddenCount = transitions.length - visibleTransitions.length

  return hiddenCount > 0
    ? [...visibleTransitions, `+ ${hiddenCount} transizioni configurate`]
    : visibleTransitions
}

function getWorkflowCountText(data: InstanceSettingsOverview): string {
  return joinCountParts([
    formatPluralCount(data.workflows.length, 'workflow', 'workflow'),
    formatPluralCount(data.phases.length, 'fase', 'fasi'),
    formatPluralCount(data.transitions.length, 'transizione', 'transizioni'),
  ])
}

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

          <ExpandableCard
            title="Fasi e workflow"
            subtitle="Workflow attivi, fasi ordinate e transizioni configurate."
          >
            <p className="section-meta">{getWorkflowCountText(data)}</p>
            <div className="split-list">
              <SectionList
                items={data.workflows.map((workflow) =>
                  getWorkflowSummary(workflow, data),
                )}
                emptyTitle="Nessun workflow"
                emptyMessage="Non sono presenti workflow attivi nel database locale."
              />
              <SectionList
                items={data.workflows.flatMap((workflow) =>
                  getTransitionItems(workflow, data),
                )}
                emptyTitle="Nessuna transizione"
                emptyMessage="Non sono presenti transizioni configurate per i workflow attivi."
              />
            </div>
          </ExpandableCard>

          <ExpandableCard
            title="Campi configurabili"
            subtitle="Campi attivi divisi tra ambito generale e ambito fase."
          >
            <p className="section-meta">
              {formatPluralCount(data.configurableFields.length, 'campo', 'campi')}
            </p>
            {data.configurableFields.length > 0 ? (
              <div className="split-list">
                <SectionList
                  items={getFirstItems(
                    data.configurableFields
                      .filter((field) => field.scope === 'GENERAL')
                      .map((field) => `${field.label} (${field.sectionKey})`),
                  )}
                  emptyTitle="Nessun campo GENERAL"
                  emptyMessage="Non sono presenti campi generali configurabili."
                />
                <SectionList
                  items={getFirstItems(
                    data.configurableFields
                      .filter((field) => field.scope === 'PHASE')
                      .map((field) => `${field.label} (${field.sectionKey})`),
                  )}
                  emptyTitle="Nessun campo PHASE"
                  emptyMessage="Non sono presenti campi configurabili per fase."
                />
              </div>
            ) : (
              <EmptyState
                title="Nessun campo configurabile"
                message="I campi configurabili saranno disponibili dopo la configurazione iniziale."
              />
            )}
          </ExpandableCard>

          <DropdownMenusSettingsCard />
        </div>
      ) : null}
    </PageContainer>
  )
}
