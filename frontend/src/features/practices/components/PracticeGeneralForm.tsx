import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import type {
  CollaboratorOverviewItem,
  ProfessionalOverviewItem,
} from '../../../types/instanceSettings.types'
import type { DropdownOption } from '../../../types/dropdownMenu.types'

export type PracticeGeneralFormValues = {
  activityType: string
  collaboratorId: string
  depositDate: string
  hearingDate: string
  judicialAuthority: string
  notes: string
  office: string
  professionalId: string
  requestedAmount: string
}

type PracticeGeneralFormProps = {
  activityOptions: DropdownOption[]
  collaborators: CollaboratorOverviewItem[]
  onChange: (values: PracticeGeneralFormValues) => void
  professionals: ProfessionalOverviewItem[]
  values: PracticeGeneralFormValues
}

export function PracticeGeneralForm({
  activityOptions,
  collaborators,
  onChange,
  professionals,
  values,
}: PracticeGeneralFormProps) {
  return (
    <section className="practice-form-section">
      <h3>Dati principali</h3>
      <div className="practice-form-grid">
        <FormField label="Collaboratore di giustizia">
          <Select
            value={values.collaboratorId}
            onChange={(event) =>
              onChange({ ...values, collaboratorId: event.target.value })
            }
          >
            <option value="">Seleziona collaboratore</option>
            {collaborators
              .filter((collaborator) => collaborator.isActive)
              .map((collaborator) => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.displayName}
                </option>
              ))}
          </Select>
        </FormField>

        <FormField label="Professionista">
          <Select
            value={values.professionalId}
            onChange={(event) =>
              onChange({ ...values, professionalId: event.target.value })
            }
          >
            <option value="">Seleziona professionista</option>
            {professionals
              .filter((professional) => professional.isActive)
              .map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.displayName}
                </option>
              ))}
          </Select>
        </FormField>

        <FormField label="Tipologia attivita">
          <Select
            value={values.activityType}
            onChange={(event) =>
              onChange({ ...values, activityType: event.target.value })
            }
          >
            <option value="">Seleziona tipologia</option>
            {activityOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Data interrogatorio/udienza *">
          <Input
            type="date"
            value={values.hearingDate}
            onChange={(event) =>
              onChange({ ...values, hearingDate: event.target.value })
            }
          />
        </FormField>

        <FormField label="Data deposito">
          <Input
            type="date"
            value={values.depositDate}
            onChange={(event) =>
              onChange({ ...values, depositDate: event.target.value })
            }
          />
        </FormField>

        <FormField label="Competenza / ufficio">
          <Input
            value={values.office}
            onChange={(event) => onChange({ ...values, office: event.target.value })}
          />
        </FormField>

        <FormField label="Autorita giudiziaria">
          <Input
            value={values.judicialAuthority}
            onChange={(event) =>
              onChange({ ...values, judicialAuthority: event.target.value })
            }
          />
        </FormField>

        <FormField label="Importo richiesto">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={values.requestedAmount}
            onChange={(event) =>
              onChange({ ...values, requestedAmount: event.target.value })
            }
          />
        </FormField>

        <FormField label="Note generali">
          <Textarea
            value={values.notes}
            onChange={(event) => onChange({ ...values, notes: event.target.value })}
            rows={3}
          />
        </FormField>
      </div>
    </section>
  )
}
