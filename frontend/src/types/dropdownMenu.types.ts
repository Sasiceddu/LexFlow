export type DropdownOption = {
  id: string
  isActive: boolean
  label: string
  menuId: string
  order: number
  triggersPecBlock: boolean
  value: string
}

export type DropdownMenu = {
  id: string
  isActive: boolean
  isSystem: boolean
  name: string
  options: DropdownOption[]
  scope: string | null
  technicalKey: string
}

export type DropdownMenuInput = {
  isActive?: boolean
  name: string
  scope?: string | null
  technicalKey?: string
}

export type DropdownMenuUpdateInput = Partial<DropdownMenuInput>

export type DropdownOptionInput = {
  isActive?: boolean
  label: string
  order?: number
  triggersPecBlock?: boolean
  value?: string
}

export type DropdownOptionUpdateInput = Partial<DropdownOptionInput>
