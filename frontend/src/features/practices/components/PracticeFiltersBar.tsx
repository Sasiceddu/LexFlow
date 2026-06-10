import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import type { PracticeFilters } from '../../../types/practice.types'
import type {
  CollaboratorOverviewItem,
  ProfessionalOverviewItem,
  WorkflowPhaseOverviewItem,
} from '../../../types/instanceSettings.types'

type PracticeFiltersBarProps = {
  collaborators: CollaboratorOverviewItem[]
  filters: PracticeFilters
  onChange: (filters: PracticeFilters) => void
  phases: WorkflowPhaseOverviewItem[]
  professionals: ProfessionalOverviewItem[]
}

function updateFilter(
  filters: PracticeFilters,
  key: keyof PracticeFilters,
  value: string,
): PracticeFilters {
  return {
    ...filters,
    [key]: value || undefined,
    page: 1,
  }
}

export function PracticeFiltersBar({
  collaborators,
  filters,
  onChange,
  phases,
  professionals,
}: PracticeFiltersBarProps) {
  return (
    <div className="practice-filters-bar">
      <FormField label="Ricerca">
        <Input
          placeholder="Cerca per codice o nome istanza"
          value={filters.search ?? ''}
          onChange={(event) =>
            onChange(updateFilter(filters, 'search', event.target.value))
          }
        />
      </FormField>
      <FormField label="Fase">
        <Select
          value={filters.phaseId ?? ''}
          onChange={(event) =>
            onChange(updateFilter(filters, 'phaseId', event.target.value))
          }
        >
          <option value="">Tutte le fasi</option>
          {phases.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Collaboratore">
        <Select
          value={filters.collaboratorId ?? ''}
          onChange={(event) =>
            onChange(updateFilter(filters, 'collaboratorId', event.target.value))
          }
        >
          <option value="">Tutti i collaboratori</option>
          {collaborators.map((collaborator) => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.displayName}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Professionista">
        <Select
          value={filters.professionalId ?? ''}
          onChange={(event) =>
            onChange(updateFilter(filters, 'professionalId', event.target.value))
          }
        >
          <option value="">Tutti i professionisti</option>
          {professionals.map((professional) => (
            <option key={professional.id} value={professional.id}>
              {professional.displayName}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="practice-filters-actions">
        <Button
          onClick={() => onChange({ page: 1, pageSize: filters.pageSize ?? 20 })}
        >
          Pulisci filtri
        </Button>
      </div>
    </div>
  )
}
