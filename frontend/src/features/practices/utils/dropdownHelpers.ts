import type { DropdownMenu, DropdownOption } from '../../../types/dropdownMenu.types'

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function findDropdownMenuByTechnicalKeyOrName(
  menus: DropdownMenu[],
  technicalKey: string,
  name: string,
): DropdownMenu | undefined {
  const normalizedKey = normalizeText(technicalKey)
  const normalizedName = normalizeText(name)

  return menus.find(
    (menu) =>
      normalizeText(menu.technicalKey) === normalizedKey ||
      normalizeText(menu.name) === normalizedName,
  )
}

export function getDropdownOptionsByMenuId(
  menus: DropdownMenu[],
  menuId: string | null,
): DropdownOption[] {
  if (!menuId) {
    return []
  }

  return (
    menus
      .find((menu) => menu.id === menuId)
      ?.options.filter((option) => option.isActive)
      .sort((first, second) => first.order - second.order) ?? []
  )
}
