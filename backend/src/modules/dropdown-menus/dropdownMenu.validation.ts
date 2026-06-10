import { z } from 'zod'

const requiredText = z.string().trim().min(1, 'Campo obbligatorio')
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

export const dropdownMenuCreateSchema = z.object({
  name: requiredText,
  technicalKey: z.string().trim().optional(),
  scope: optionalText,
  isSystem: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const dropdownMenuUpdateSchema = z
  .object({
    name: requiredText.optional(),
    technicalKey: z.string().trim().optional(),
    scope: optionalText,
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export const dropdownOptionCreateSchema = z.object({
  label: requiredText,
  value: z.string().trim().optional(),
  order: z.number().int().min(0).optional(),
  triggersPecBlock: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const dropdownOptionUpdateSchema = z
  .object({
    label: requiredText.optional(),
    value: z.string().trim().optional(),
    order: z.number().int().min(0).optional(),
    triggersPecBlock: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export type DropdownMenuCreateInput = z.infer<typeof dropdownMenuCreateSchema>
export type DropdownMenuUpdateInput = z.infer<typeof dropdownMenuUpdateSchema>
export type DropdownOptionCreateInput = z.infer<typeof dropdownOptionCreateSchema>
export type DropdownOptionUpdateInput = z.infer<typeof dropdownOptionUpdateSchema>
