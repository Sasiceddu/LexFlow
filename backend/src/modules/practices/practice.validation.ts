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

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

const optionalId = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

const validDate = z
  .string()
  .trim()
  .min(1, 'Data obbligatoria')
  .transform((value, context) => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      context.addIssue({
        code: 'custom',
        message: 'Data non valida',
      })

      return z.NEVER
    }

    return date
  })

const optionalDate = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value.length === 0) {
      return null
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      context.addIssue({
        code: 'custom',
        message: 'Data non valida',
      })

      return z.NEVER
    }

    return date
  })
  .nullable()
  .optional()

const optionalAmount = z
  .union([z.number(), z.string()])
  .transform((value, context) => {
    if (typeof value === 'string' && value.trim().length === 0) {
      return null
    }

    const normalized = typeof value === 'number' ? value : Number(value)

    if (Number.isNaN(normalized)) {
      context.addIssue({
        code: 'custom',
        message: 'Importo richiesto non valido',
      })

      return z.NEVER
    }

    return normalized.toString()
  })
  .nullable()
  .optional()

const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
)

const customDataSchema = z
  .record(z.string(), jsonValueSchema)
  .optional()

export const practiceCreateSchema = z.object({
  activityType: optionalText,
  collaboratorId: optionalId,
  customData: customDataSchema,
  depositDate: optionalDate,
  hearingDate: validDate,
  judicialAuthority: optionalText,
  notes: optionalText,
  office: optionalText,
  professionalId: optionalId,
  requestedAmount: optionalAmount,
})

export type PracticeListQueryInput = z.infer<typeof practiceListQuerySchema>
export type PracticeCreateInput = z.infer<typeof practiceCreateSchema>
