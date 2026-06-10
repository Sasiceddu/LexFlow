import { z } from 'zod'

const requiredName = z.string().trim().min(1, 'Campo obbligatorio')
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

export const collaboratorCreateSchema = z.object({
  firstName: requiredName,
  lastName: requiredName,
  displayName: z.string().trim().optional(),
  notes: optionalText,
  isActive: z.boolean().optional(),
})

export const collaboratorUpdateSchema = z
  .object({
    firstName: requiredName.optional(),
    lastName: requiredName.optional(),
    displayName: z.string().trim().optional(),
    notes: optionalText,
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export type CollaboratorCreateInput = z.infer<typeof collaboratorCreateSchema>
export type CollaboratorUpdateInput = z.infer<typeof collaboratorUpdateSchema>
