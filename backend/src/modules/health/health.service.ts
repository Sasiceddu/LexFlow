import { getDatabaseHealth } from './health.repository'
import type { HealthResponse } from './health.types'

export async function getHealthStatus(): Promise<HealthResponse> {
  const database = await getDatabaseHealth()

  return {
    status: 'ok',
    app: 'LexFlow',
    mode: 'local-backend',
    database,
  }
}
