export type AppEnv = {
  name: string
  nodeEnv: string
  port: number
}

function readPort(value: string | undefined): number {
  const fallbackPort = 3001

  if (!value) {
    return fallbackPort
  }

  const parsedPort = Number.parseInt(value, 10)

  return Number.isNaN(parsedPort) ? fallbackPort : parsedPort
}

export const env: AppEnv = {
  name: 'LexFlow',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readPort(process.env.PORT),
}
