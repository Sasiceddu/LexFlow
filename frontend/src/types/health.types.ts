export type BackendDatabaseHealth = {
  seeded?: boolean
  status: string
}

export type BackendHealthResponse = {
  app: string
  database?: BackendDatabaseHealth
  mode: string
  status: string
}
