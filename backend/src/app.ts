import express from 'express'
import { collaboratorRouter } from './modules/collaborators/collaborator.routes'
import {
  dropdownMenuRouter,
  dropdownOptionRouter,
} from './modules/dropdown-menus/dropdownMenu.routes'
import { healthRouter } from './modules/health/health.routes'
import { instanceSettingsRouter } from './modules/instance-settings/instanceSettings.routes'
import { professionalRouter } from './modules/professionals/professional.routes'
import { corsMiddleware } from './middlewares/cors.middleware'
import { errorMiddleware } from './middlewares/error.middleware'
import { notFoundMiddleware } from './middlewares/notFound.middleware'

export function createApp() {
  const app = express()

  app.use(corsMiddleware)
  app.use(express.json())
  app.use('/api', healthRouter)
  app.use('/api/collaborators', collaboratorRouter)
  app.use('/api/dropdown-menus', dropdownMenuRouter)
  app.use('/api/dropdown-options', dropdownOptionRouter)
  app.use('/api/instance-settings', instanceSettingsRouter)
  app.use('/api/professionals', professionalRouter)
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
