import express from 'express'
import { healthRouter } from './modules/health/health.routes'
import { instanceSettingsRouter } from './modules/instance-settings/instanceSettings.routes'
import { corsMiddleware } from './middlewares/cors.middleware'
import { errorMiddleware } from './middlewares/error.middleware'
import { notFoundMiddleware } from './middlewares/notFound.middleware'

export function createApp() {
  const app = express()

  app.use(corsMiddleware)
  app.use(express.json())
  app.use('/api', healthRouter)
  app.use('/api/instance-settings', instanceSettingsRouter)
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
