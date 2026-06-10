import { z } from 'zod'

export const configurableFieldScopeSchema = z.enum(['GENERAL', 'PHASE'])

export const configurableFieldTypeSchema = z.enum([
  'SHORT_TEXT',
  'LONG_TEXT',
  'NUMBER',
  'AMOUNT',
  'DATE',
  'DROPDOWN',
  'BOOLEAN',
  'NOTE',
  'FILE',
])

const requiredText = z.string().trim().min(1, 'Campo obbligatorio')
const optionalId = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

export const configurableFieldCreateSchema = z.object({
  label: requiredText,
  technicalKey: z.string().trim().optional(),
  scope: configurableFieldScopeSchema,
  sectionKey: requiredText,
  phaseId: optionalId,
  fieldType: configurableFieldTypeSchema,
  dropdownMenuId: optionalId,
  isRequired: z.boolean().optional(),
  showInTable: z.boolean().optional(),
  useInFilters: z.boolean().optional(),
  includeInExport: z.boolean().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean().optional(),
})

export const configurableFieldUpdateSchema = z
  .object({
    label: requiredText.optional(),
    technicalKey: z.string().trim().optional(),
    scope: configurableFieldScopeSchema.optional(),
    sectionKey: requiredText.optional(),
    phaseId: optionalId,
    fieldType: configurableFieldTypeSchema.optional(),
    dropdownMenuId: optionalId,
    isRequired: z.boolean().optional(),
    showInTable: z.boolean().optional(),
    useInFilters: z.boolean().optional(),
    includeInExport: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export type ConfigurableFieldCreateInput = z.infer<
  typeof configurableFieldCreateSchema
>
export type ConfigurableFieldUpdateInput = z.infer<
  typeof configurableFieldUpdateSchema
>
