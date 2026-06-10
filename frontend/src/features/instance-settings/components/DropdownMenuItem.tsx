import { ActionRow } from '../../../components/shared/ActionRow'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import type {
  DropdownMenu,
  DropdownOption,
} from '../../../types/dropdownMenu.types'

type DropdownMenuItemProps = {
  menu: DropdownMenu
  onAddOption: (menu: DropdownMenu) => void
  onDeleteMenu: (menu: DropdownMenu) => void
  onDeleteOption: (option: DropdownOption) => void
  onEditMenu: (menu: DropdownMenu) => void
  onEditOption: (option: DropdownOption) => void
  onTogglePecBlock: (option: DropdownOption) => void
}

export function DropdownMenuItem({
  menu,
  onAddOption,
  onDeleteMenu,
  onDeleteOption,
  onEditMenu,
  onEditOption,
  onTogglePecBlock,
}: DropdownMenuItemProps) {
  return (
    <article className="dropdown-menu-item">
      <div className="dropdown-menu-item-header">
        <div className="person-summary">
          <strong>{menu.name}</strong>
          <span>Valore tecnico: {menu.technicalKey}</span>
          {menu.scope ? <span>Ambito: {menu.scope}</span> : null}
          {menu.isSystem ? <span>Menu di sistema</span> : null}
        </div>
        <ActionRow>
          <Button onClick={() => onAddOption(menu)} variant="primary">
            Aggiungi opzione
          </Button>
          <Button onClick={() => onEditMenu(menu)}>Modifica menu</Button>
          <Button onClick={() => onDeleteMenu(menu)} variant="danger">
            Disattiva menu
          </Button>
        </ActionRow>
      </div>

      {menu.options.length > 0 ? (
        <ul className="dropdown-option-list">
          {menu.options.map((option) => (
            <li key={option.id}>
              <div className="person-summary">
                <strong>{option.label}</strong>
                <span>Valore: {option.value}</span>
                <span>Ordine: {option.order}</span>
                {option.triggersPecBlock ? <span>Blocco PEC attivo</span> : null}
              </div>
              <ActionRow>
                <Checkbox
                  label="Attiva blocco PEC"
                  checked={option.triggersPecBlock}
                  onChange={() => onTogglePecBlock(option)}
                />
                <Button onClick={() => onEditOption(option)}>
                  Modifica opzione
                </Button>
                <Button onClick={() => onDeleteOption(option)} variant="danger">
                  Cestina opzione
                </Button>
              </ActionRow>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Nessuna opzione"
          message="Questo menu non ha ancora opzioni attive."
        />
      )}
    </article>
  )
}
