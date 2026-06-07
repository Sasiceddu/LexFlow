import { prisma } from '../../database/prismaClient'
import type { DatabaseHealth } from './health.types'

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  await prisma.$queryRaw`SELECT 1`

  return {
    status: 'connected',
  }
}
