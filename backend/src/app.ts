import express from 'express'
import { healthRouter } from './modules/health/health.routes'
import { errorMiddleware } from './middlewares/error.middleware'
import { notFoundMiddleware } from './middlewares/notFound.middleware'

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use('/api', healthRouter)
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
