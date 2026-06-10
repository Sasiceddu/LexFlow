import { z } from 'zod'

const optionalFilterText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional()

const paginationNumber = (fallback: number, max?: number) =>
  z
    .string()
    .optional()
    .transform((value) => {
      const parsed = Number.parseInt(value ?? '', 10)

      if (Number.isNaN(parsed)) {
        return fallback
      }

      const positive = Math.max(1, parsed)

      return max ? Math.min(positive, max) : positive
    })

export const practiceListQuerySchema = z.object({
  collaboratorId: optionalFilterText,
  page: paginationNumber(1),
  pageSize: paginationNumber(20, 100),
  phaseId: optionalFilterText,
  professionalId: optionalFilterText,
  search: optionalFilterText,
})

export type PracticeListQueryInput = z.infer<typeof practiceListQuerySchema>
