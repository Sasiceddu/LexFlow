import { z } from 'zod'

const requiredText = z.string().trim().min(1, 'Campo obbligatorio')
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()

export const workflowCreateSchema = z.object({
  name: requiredText,
  description: optionalText,
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const workflowUpdateSchema = z
  .object({
    name: requiredText.optional(),
    description: optionalText,
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export const workflowPhaseCreateSchema = z.object({
  name: requiredText,
  technicalKey: z.string().trim().optional(),
  category: requiredText,
  description: optionalText,
  order: z.number().int().min(0),
  color: optionalText,
  isInitial: z.boolean().optional(),
  isFinal: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const workflowPhaseUpdateSchema = z
  .object({
    name: requiredText.optional(),
    technicalKey: z.string().trim().optional(),
    category: requiredText.optional(),
    description: optionalText,
    order: z.number().int().min(0).optional(),
    color: optionalText,
    isInitial: z.boolean().optional(),
    isFinal: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export const workflowTransitionCreateSchema = z.object({
  fromPhaseId: requiredText,
  toPhaseId: requiredText,
  actionLabel: requiredText,
  technicalKey: z.string().trim().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean().optional(),
})

export const workflowTransitionUpdateSchema = z
  .object({
    fromPhaseId: requiredText.optional(),
    toPhaseId: requiredText.optional(),
    actionLabel: requiredText.optional(),
    technicalKey: z.string().trim().optional(),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Nessun dato da aggiornare',
  })

export type WorkflowCreateInput = z.infer<typeof workflowCreateSchema>
export type WorkflowUpdateInput = z.infer<typeof workflowUpdateSchema>
export type WorkflowPhaseCreateInput = z.infer<
  typeof workflowPhaseCreateSchema
>
export type WorkflowPhaseUpdateInput = z.infer<
  typeof workflowPhaseUpdateSchema
>
export type WorkflowTransitionCreateInput = z.infer<
  typeof workflowTransitionCreateSchema
>
export type WorkflowTransitionUpdateInput = z.infer<
  typeof workflowTransitionUpdateSchema
>
