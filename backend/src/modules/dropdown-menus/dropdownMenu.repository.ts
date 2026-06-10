import { prisma } from '../../database/prismaClient'
import type {
  DropdownMenuPayload,
  DropdownMenuUpdatePayload,
  DropdownOptionPayload,
  DropdownOptionUpdatePayload,
} from './dropdownMenu.types'

const optionSelect = {
  id: true,
  menuId: true,
  label: true,
  value: true,
  order: true,
  triggersPecBlock: true,
  isActive: true,
} as const

export function findDropdownMenus() {
  return prisma.dropdownMenu.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      technicalKey: true,
      scope: true,
      isSystem: true,
      isActive: true,
      options: {
        where: {
          deletedAt: null,
          isActive: true,
        },
        orderBy: [{ order: 'asc' }, { label: 'asc' }],
        select: optionSelect,
      },
    },
  })
}

export function findDropdownMenuById(id: string) {
  return prisma.dropdownMenu.findUnique({
    where: {
      id,
    },
  })
}

export function findDropdownMenuByTechnicalKey(
  technicalKey: string,
  excludedId?: string,
) {
  return prisma.dropdownMenu.findFirst({
    where: {
      technicalKey,
      id: excludedId ? { not: excludedId } : undefined,
    },
  })
}

export function createDropdownMenu(data: DropdownMenuPayload) {
  return prisma.dropdownMenu.create({
    data,
  })
}

export function updateDropdownMenu(
  id: string,
  data: DropdownMenuUpdatePayload,
) {
  return prisma.dropdownMenu.update({
    where: {
      id,
    },
    data,
  })
}

export function deactivateDropdownMenu(id: string) {
  return prisma.dropdownMenu.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  })
}

export function countConfigurableFieldsUsingMenu(menuId: string) {
  return prisma.configurableField.count({
    where: {
      dropdownMenuId: menuId,
      deletedAt: null,
    },
  })
}

export function findDropdownOptions(menuId: string) {
  return prisma.dropdownOption.findMany({
    where: {
      menuId,
      deletedAt: null,
      isActive: true,
    },
    orderBy: [{ order: 'asc' }, { label: 'asc' }],
    select: optionSelect,
  })
}

export function findDropdownOptionById(id: string) {
  return prisma.dropdownOption.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })
}

export function findDropdownOptionByValue(
  menuId: string,
  value: string,
  excludedId?: string,
) {
  return prisma.dropdownOption.findFirst({
    where: {
      menuId,
      value,
      deletedAt: null,
      id: excludedId ? { not: excludedId } : undefined,
    },
  })
}

export function createDropdownOption(
  menuId: string,
  data: DropdownOptionPayload,
) {
  return prisma.dropdownOption.create({
    data: {
      ...data,
      menuId,
    },
  })
}

export function updateDropdownOption(
  id: string,
  data: DropdownOptionUpdatePayload,
) {
  return prisma.dropdownOption.update({
    where: {
      id,
    },
    data,
  })
}

export function softDeleteDropdownOption(id: string) {
  return prisma.dropdownOption.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  })
}
