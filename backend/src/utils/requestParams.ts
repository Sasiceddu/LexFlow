import type { Request } from 'express'
import { AppError } from '../errors/AppError'

export function getParam(request: Request, key: string, label: string): string {
  const value = request.params[key]

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(`${label} non valido.`, 400)
  }

  return value
}
