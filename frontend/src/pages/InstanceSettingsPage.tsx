import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { InstanceSettingsCard } from '../components/shared/InstanceSettingsCard'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { SectionList } from '../components/shared/SectionList'
import { useInstanceSettingsOverview } from '../hooks/useInstanceSettingsOverview'
import type {
  DropdownMenuOverviewItem,
  DropdownOptionOverviewItem,
  InstanceSettingsOverview,
  WorkflowOverviewItem,
} from '../types/instanceSettings.types'

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

function getMenuSummary(
  menu: DropdownMenuOverviewItem,
  options: DropdownOptionOverviewItem[],
): string {
  const optionLabels = options.map((option) =>
    option.triggersPecBlock ? `${option.label} (blocco PEC)` : option.label,
  )

  return optionLabels.length > 0
    ? `${menu.name}: ${optionLabels.join(', ')}`
    : `${menu.name}: nessuna opzione attiva`
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
      description="Base in sola lettura collegata al database locale."
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

      {data ? (
        <div className="instance-settings-grid">
          <InstanceSettingsCard
            title="Professionisti"
            description="Professionisti non cestinati disponibili per le pratiche."
            count={data.professionals.length}
          >
            <SectionList
              items={getFirstItems(
                data.professionals.map((item) =>
                  item.email ? `${item.displayName} - ${item.email}` : item.displayName,
                ),
              )}
              emptyTitle="Nessun professionista"
              emptyMessage="Non sono presenti professionisti nel database locale."
            />
          </InstanceSettingsCard>

          <InstanceSettingsCard
            title="Collaboratori di giustizia"
            description="Collaboratori non cestinati collegabili alle pratiche."
            count={data.collaborators.length}
          >
            <SectionList
              items={getFirstItems(
                data.collaborators.map((item) => item.displayName),
              )}
              emptyTitle="Nessun collaboratore"
              emptyMessage="Non sono presenti collaboratori di giustizia nel database locale."
            />
          </InstanceSettingsCard>

          <InstanceSettingsCard
            title="Fasi e workflow"
            description="Workflow attivi, fasi ordinate e transizioni configurate."
            count={data.workflows.length}
          >
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
          </InstanceSettingsCard>

          <InstanceSettingsCard
            title="Campi configurabili"
            description="Campi attivi divisi tra ambito generale e ambito fase."
            count={data.configurableFields.length}
          >
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
          </InstanceSettingsCard>

          <InstanceSettingsCard
            title="Menu a tendina"
            description="Menu attivi e opzioni collegate, inclusa la regola PEC."
            count={data.dropdownMenus.length}
          >
            <SectionList
              items={data.dropdownMenus.map((menu) =>
                getMenuSummary(
                  menu,
                  data.dropdownOptions.filter((option) => option.menuId === menu.id),
                ),
              )}
              emptyTitle="Nessun menu"
              emptyMessage="Non sono presenti menu a tendina attivi nel database locale."
            />
          </InstanceSettingsCard>
        </div>
      ) : null}
    </PageContainer>
  )
}
