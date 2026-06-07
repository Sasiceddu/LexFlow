import type { HealthResponse } from './health.types'

export function getHealthStatus(): HealthResponse {
  return {
    status: 'ok',
    app: 'LexFlow',
    mode: 'local-backend',
  }
}
