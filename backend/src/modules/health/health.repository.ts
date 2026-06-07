import { prisma } from '../../database/prismaClient'
import type { DatabaseHealth } from './health.types'

async function hasInitialSeedData(): Promise<boolean> {
  try {
    const workflowCount = await prisma.workflow.count({
      where: {
        name: 'Workflow istanze di liquidazione',
      },
    })

    return workflowCount > 0
  } catch (_error: unknown) {
    return false
  }
}

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  await prisma.$queryRaw`SELECT 1`

  return {
    status: 'connected',
    seeded: await hasInitialSeedData(),
  }
}
