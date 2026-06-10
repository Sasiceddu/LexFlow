import { prisma } from '../../database/prismaClient'
import type {
  CollaboratorPayload,
  CollaboratorUpdatePayload,
} from './collaborator.types'

export function findCollaborators() {
  return prisma.collaborator.findMany({
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
      notes: true,
      isActive: true,
    },
  })
}

export function findCollaboratorById(id: string) {
  return prisma.collaborator.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })
}

export function findCollaboratorByDisplayName(
  displayName: string,
  excludedId?: string,
) {
  return prisma.collaborator.findFirst({
    where: {
      displayName,
      deletedAt: null,
      id: excludedId ? { not: excludedId } : undefined,
    },
  })
}

export function createCollaborator(data: Required<CollaboratorPayload>) {
  return prisma.collaborator.create({
    data,
  })
}

export function updateCollaborator(
  id: string,
  data: CollaboratorUpdatePayload,
) {
  return prisma.collaborator.update({
    where: {
      id,
    },
    data,
  })
}

export function softDeleteCollaborator(id: string) {
  return prisma.collaborator.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  })
}
