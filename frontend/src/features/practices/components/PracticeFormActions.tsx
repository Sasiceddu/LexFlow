import { ActionRow } from '../../../components/shared/ActionRow'
import { Button } from '../../../components/ui/Button'

type PracticeFormActionsProps = {
  isSaving: boolean
  onCancel: () => void
}

export function PracticeFormActions({
  isSaving,
  onCancel,
}: PracticeFormActionsProps) {
  return (
    <ActionRow>
      <Button type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Salvataggio...' : 'Crea pratica'}
      </Button>
      <Button onClick={onCancel} disabled={isSaving}>
        Annulla
      </Button>
    </ActionRow>
  )
}
