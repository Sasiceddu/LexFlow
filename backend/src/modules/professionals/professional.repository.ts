import { prisma } from '../../database/prismaClient'
import type {
  ProfessionalPayload,
  ProfessionalUpdatePayload,
} from './professional.types'

export function findProfessionals() {
  return prisma.professional.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      displayName: 'asc',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
      phone: true,
      notes: true,
      isActive: true,
    },
  })
}

export function findProfessionalById(id: string) {
  return prisma.professional.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })
}

export function findProfessionalByDisplayName(
  displayName: string,
  excludedId?: string,
) {
  return prisma.professional.findFirst({
    where: {
      displayName,
      deletedAt: null,
      id: excludedId ? { not: excludedId } : undefined,
    },
  })
}

export function createProfessional(data: Required<ProfessionalPayload>) {
  return prisma.professional.create({
    data,
  })
}

export function updateProfessional(
  id: string,
  data: ProfessionalUpdatePayload,
) {
  return prisma.professional.update({
    where: {
      id,
    },
    data,
  })
}

export function softDeleteProfessional(id: string) {
  return prisma.professional.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  })
}
