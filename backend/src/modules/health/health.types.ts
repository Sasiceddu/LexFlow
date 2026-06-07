export type DatabaseHealth = {
  seeded: boolean
  status: 'connected'
}

export type HealthResponse = {
  app: 'LexFlow'
  database: DatabaseHealth
  mode: 'local-backend'
  status: 'ok'
}
