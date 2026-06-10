import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'

export function toAppError(error: unknown, fallback: string): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ZodError) {
    return new AppError(
      error.issues.map((issue) => issue.message).join('; '),
      400,
    )
  }

  return new AppError(fallback, 400)
}
