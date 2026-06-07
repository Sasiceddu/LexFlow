import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/AppError'

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      status: 'error',
    })
    return
  }

  response.status(500).json({
    message: 'Internal server error',
    status: 'error',
  })
}
