import { Link } from 'react-router-dom'
import { EntityLink } from '../../../components/ui/EntityLink'
import { practiceDetailPath } from '../../../routes/routePaths'
import type { PracticeListItem } from '../../../types/practice.types'
import { formatAmount, formatDate, formatText } from '../../../utils/formatters'
import { PracticesEmptyState } from './PracticesEmptyState'

type PracticesTableProps = {
  practices: PracticeListItem[]
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
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {practices.map((practice) => (
            <tr key={practice.id}>
              <td>
                <EntityLink
                  to={practiceDetailPath(practice.id)}
                  ariaLabel={`Apri pratica ${practice.code}`}
                >
                  {practice.code}
                </EntityLink>
              </td>
              <td>
                <EntityLink
                  to={practiceDetailPath(practice.id)}
                  ariaLabel={`Apri pratica ${practice.code}`}
                >
                  {practice.name}
                </EntityLink>
              </td>
              <td>{formatText(practice.collaboratorName)}</td>
              <td>{formatText(practice.professionalName)}</td>
              <td>{formatText(practice.currentPhaseName)}</td>
              <td>{formatDate(practice.depositDate)}</td>
              <td>{formatAmount(practice.requestedAmount)}</td>
              <td>{formatDate(practice.updatedAt)}</td>
              <td>
                <Link
                  className="ui-button ui-button-secondary"
                  to={practiceDetailPath(practice.id)}
                  aria-label={`Apri pratica ${practice.code}`}
                >
                  Apri
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
