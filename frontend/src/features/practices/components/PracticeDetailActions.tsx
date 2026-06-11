import { Link } from 'react-router-dom'
import { ActionRow } from '../../../components/shared/ActionRow'
import { routePaths } from '../../../routes/routePaths'

export function PracticeDetailActions() {
  return (
    <ActionRow>
      <Link className="ui-button ui-button-secondary" to={routePaths.practices}>
        Torna a Pratiche
      </Link>
    </ActionRow>
  )
}
