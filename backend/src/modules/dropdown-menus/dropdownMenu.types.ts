export type DropdownMenuPayload = {
  isActive?: boolean
  isSystem?: boolean
  name: string
  scope?: string | null
  technicalKey: string
}

export type DropdownMenuUpdatePayload = Partial<DropdownMenuPayload>

export type DropdownOptionPayload = {
  isActive?: boolean
  label: string
  order: number
  triggersPecBlock?: boolean
  value: string
}

export type DropdownOptionUpdatePayload = Partial<DropdownOptionPayload>
