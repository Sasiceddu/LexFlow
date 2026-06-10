import { z } from 'zod'

const requiredName = z.string().trim().min(1, 'Campo obbligatorio')
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

export const professionalCreateSchema = z.object({
  firstName: requiredName,
  lastName: requiredName,
  displayName: z.string().trim().optional(),
  email: z.string().trim().email('Email non valida').nullable().optional(),
  phone: optionalText,
  notes: optionalText,
  isActive: z.boolean().optional(),
})

export const professionalUpdateSchema = z
  .object({
    firstName: requiredName.optional(),
    lastName: requiredName.optional(),
    displayName: z.string().trim().optional(),
    email: z.string().trim().email('Email non valida').nullable().optional(),
    phone: optionalText,
    notes: optionalText,
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export type ProfessionalCreateInput = z.infer<typeof professionalCreateSchema>
export type ProfessionalUpdateInput = z.infer<typeof professionalUpdateSchema>
