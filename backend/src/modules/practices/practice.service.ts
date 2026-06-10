import { ZodError } from 'zod'
import { AppError } from '../../errors/AppError'
import { countPractices, findPractices } from './practice.repository'
import type { PracticeListFilters, PracticeListResponse } from './practice.types'
import {
  practiceListQuerySchema,
  type PracticeListQueryInput,
} from './practice.validation'

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ZodError) {
    return new AppError(
      error.issues.map((issue) => issue.message).join('; '),
      400,
    )
  }

  return new AppError('Filtri pratiche non validi.', 400)
}

function normalizeFilters(input: PracticeListQueryInput): PracticeListFilters {
  return {
    collaboratorId: input.collaboratorId,
    page: input.page,
    pageSize: input.pageSize,
    phaseId: input.phaseId,
    professionalId: input.professionalId,
    search: input.search,
  }
}

export async function listPractices(query: unknown): Promise<PracticeListResponse> {
  try {
    const filters = normalizeFilters(practiceListQuerySchema.parse(query))
    const total = await countPractices(filters)
    const totalPages = total > 0 ? Math.ceil(total / filters.pageSize) : 0
    const safePage =
      totalPages > 0 ? Math.min(filters.page, totalPages) : filters.page
    const safeFilters = {
      ...filters,
      page: safePage,
    }
    const items = await findPractices(safeFilters)

    return {
      items,
      pagination: {
        page: safePage,
        pageSize: filters.pageSize,
        total,
        totalPages,
      },
    }
  } catch (error: unknown) {
    throw toAppError(error)
  }
}
