import type { PracticeListItem } from '../../../types/practice.types'
import { PracticesEmptyState } from './PracticesEmptyState'

type PracticesTableProps = {
  practices: PracticeListItem[]
}

function formatDate(value: string | null): string {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('it-IT').format(new Date(value))
}

function formatAmount(value: string | null): string {
  if (!value) {
    return '-'
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return new Intl.NumberFormat('it-IT', {
    currency: 'EUR',
    style: 'currency',
  }).format(amount)
}

function formatText(value: string | null): string {
  return value && value.trim().length > 0 ? value : '-'
}

export function PracticesTable({ practices }: PracticesTableProps) {
  if (practices.length === 0) {
    return <PracticesEmptyState />
  }

  return (
    <div className="table-scroll">
      <table className="practices-table">
        <thead>
          <tr>
            <th>Codice</th>
            <th>Nome istanza</th>
            <th>Collaboratore</th>
            <th>Professionista</th>
            <th>Fase</th>
            <th>Data deposito</th>
            <th>Importo richiesto</th>
            <th>Aggiornata il</th>
          </tr>
        </thead>
        <tbody>
          {practices.map((practice) => (
            <tr key={practice.id}>
              <td>{practice.code}</td>
              <td>{practice.name}</td>
              <td>{formatText(practice.collaboratorName)}</td>
              <td>{formatText(practice.professionalName)}</td>
              <td>{formatText(practice.currentPhaseName)}</td>
              <td>{formatDate(practice.depositDate)}</td>
              <td>{formatAmount(practice.requestedAmount)}</td>
              <td>{formatDate(practice.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
