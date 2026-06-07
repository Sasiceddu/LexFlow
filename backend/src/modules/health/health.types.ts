export type DatabaseHealth = {
  status: 'connected'
}

export type HealthResponse = {
  app: 'LexFlow'
  database: DatabaseHealth
  mode: 'local-backend'
  status: 'ok'
}
