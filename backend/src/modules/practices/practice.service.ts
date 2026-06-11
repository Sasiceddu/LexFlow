import { AppError } from '../../errors/AppError'
import type { Prisma } from '../../generated/prisma/client'
import {
  countPractices,
  createPhaseChangedHistoryEvent,
  createPractice,
  createPracticeHistoryEvent,
  findActiveDropdownOptionValues,
  findCollaboratorById,
  findDefaultWorkflowWithInitialPhase,
  findPhaseFields,
  findPracticeByCode,
  findPracticeCodesByYear,
  findPracticeDetailById,
  findPracticeForAdvance,
  findPractices,
  findProfessionalById,
  findTransitionForAdvance,
  mapPracticeDetail,
  mapPracticeListItem,
  toJsonObject,
  updatePracticePhase,
} from './practice.repository'
import type {
  CreatePracticePayload,
  JsonObject,
  JsonValue,
  PracticeDetail,
  PracticeListFilters,
  PracticeListItem,
  PracticeListResponse,
} from './practice.types'
import {
  advancePracticeSchema,
  practiceCreateSchema,
  practiceListQuerySchema,
  type PracticeCreateInput,
  type PracticeListQueryInput,
} from './practice.validation'
import { toAppError } from '../../utils/appError'

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

function padNumber(value: number, length: number): string {
  return value.toString().padStart(length, '0')
}

function getDateCode(date: Date): string {
  const year = date.getUTCFullYear()
  const month = padNumber(date.getUTCMonth() + 1, 2)
  const day = padNumber(date.getUTCDate(), 2)

  return `${year}${month}${day}`
}

function getAnnualProgressive(codes: { code: string }[], year: string): number {
  const pattern = new RegExp(`^${year}\\d{4}NP(\\d{3})$`)

  return codes.reduce((max, item) => {
    const match = item.code.match(pattern)
    const progressive = match ? Number.parseInt(match[1], 10) : 0

    return Number.isNaN(progressive) ? max : Math.max(max, progressive)
  }, 0)
}

function toCreatePayload(input: PracticeCreateInput): CreatePracticePayload {
  return {
    activityType: input.activityType ?? null,
    collaboratorId: input.collaboratorId ?? null,
    customData: input.customData as JsonObject | undefined,
    depositDate: input.depositDate ?? null,
    hearingDate: input.hearingDate,
    judicialAuthority: input.judicialAuthority ?? null,
    notes: input.notes ?? null,
    office: input.office ?? null,
    professionalId: input.professionalId ?? null,
    requestedAmount: input.requestedAmount ?? null,
  }
}

async function assertLinkedRecords(input: CreatePracticePayload) {
  if (input.collaboratorId) {
    const collaborator = await findCollaboratorById(input.collaboratorId)

    if (!collaborator) {
      throw new AppError('Collaboratore di giustizia non trovato.', 404)
    }
  }

  if (input.professionalId) {
    const professional = await findProfessionalById(input.professionalId)

    if (!professional) {
      throw new AppError('Professionista non trovato.', 404)
    }
  }
}

async function generatePracticeCode(hearingDate: Date): Promise<string> {
  const dateCode = getDateCode(hearingDate)
  const year = dateCode.slice(0, 4)
  const existingCodes = await findPracticeCodesByYear(year)
  let progressive = getAnnualProgressive(existingCodes, year) + 1

  while (progressive < 1000) {
    const code = `${dateCode}NP${padNumber(progressive, 3)}`
    const existingPractice = await findPracticeByCode(code)

    if (!existingPractice) {
      return code
    }

    progressive += 1
  }

  throw new AppError('Progressivo annuale pratiche esaurito.', 409)
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
    throw toAppError(error, 'Filtri pratiche non validi.')
  }
}

export async function addPractice(body: unknown): Promise<PracticeListItem> {
  try {
    const input = toCreatePayload(practiceCreateSchema.parse(body))
    const workflow = await findDefaultWorkflowWithInitialPhase()

    if (!workflow) {
      throw new AppError('Workflow default attivo non configurato.', 409)
    }

    const initialPhase = workflow.phases[0]

    if (!initialPhase) {
      throw new AppError('Fase iniziale del workflow default non configurata.', 409)
    }

    await assertLinkedRecords(input)

    const dateCode = getDateCode(input.hearingDate)
    const code = await generatePracticeCode(input.hearingDate)
    const name = `${dateCode}_NOTA_SPESE`
    const createdPractice = await createPractice({
      activityType: input.activityType ?? null,
      code,
      collaboratorId: input.collaboratorId ?? null,
      currentPhaseId: initialPhase.id,
      customData: input.customData as Prisma.InputJsonValue | undefined,
      depositDate: input.depositDate ?? null,
      hearingDate: input.hearingDate,
      judicialAuthority: input.judicialAuthority ?? null,
      name,
      notes: input.notes ?? null,
      office: input.office ?? null,
      professionalId: input.professionalId ?? null,
      requestedAmount: input.requestedAmount ?? null,
      workflowId: workflow.id,
    })

    await createPracticeHistoryEvent({
      data: {
        code,
        currentPhaseName: initialPhase.name,
        name,
        workflowName: workflow.name,
      },
      practiceId: createdPractice.id,
      toPhaseId: initialPhase.id,
    })

    return mapPracticeListItem(createdPractice)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati pratica non validi.')
  }
}

export async function getPracticeById(id: string): Promise<PracticeDetail> {
  const practice = await findPracticeDetailById(id)

  if (!practice) {
    throw new AppError('Pratica non trovata.', 404)
  }

  return mapPracticeDetail(practice)
}

function isFilledJsonValue(value: JsonValue | undefined): boolean {
  if (value === undefined || value === null) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  return true
}

async function assertPhaseDataIsValid(
  phaseId: string,
  phaseData: JsonObject,
): Promise<void> {
  const phaseFields = await findPhaseFields(phaseId)
  const dropdownMenuIds = phaseFields
    .map((field) => field.dropdownMenuId)
    .filter((menuId): menuId is string => Boolean(menuId))
  const activeOptions =
    dropdownMenuIds.length > 0
      ? await findActiveDropdownOptionValues(dropdownMenuIds)
      : []

  for (const field of phaseFields) {
    const value = phaseData[field.technicalKey]

    if (field.isRequired && !isFilledJsonValue(value)) {
      throw new AppError(`Il campo "${field.label}" e obbligatorio.`, 400)
    }

    if (field.fieldType === 'DROPDOWN' && field.dropdownMenuId && isFilledJsonValue(value)) {
      const validValues = activeOptions
        .filter((option) => option.menuId === field.dropdownMenuId)
        .map((option) => option.value)

      if (typeof value !== 'string' || !validValues.includes(value)) {
        throw new AppError(`Il valore selezionato per "${field.label}" non e valido.`, 400)
      }
    }
  }
}

export async function advancePractice(id: string, body: unknown): Promise<PracticeDetail> {
  try {
    const input = advancePracticeSchema.parse(body)
    const practice = await findPracticeForAdvance(id)

    if (!practice) {
      throw new AppError('Pratica non trovata.', 404)
    }

    const transition = await findTransitionForAdvance(input.transitionId)

    if (!transition) {
      throw new AppError('Transizione non trovata.', 404)
    }

    if (!transition.isActive) {
      throw new AppError('La transizione selezionata non e attiva.', 400)
    }

    if (transition.workflowId !== practice.workflowId) {
      throw new AppError('La transizione non appartiene al workflow della pratica.', 400)
    }

    if (transition.fromPhaseId !== practice.currentPhaseId) {
      throw new AppError(
        'La transizione non e disponibile dalla fase corrente della pratica.',
        400,
      )
    }

    if (!transition.toPhase || transition.toPhase.deletedAt || !transition.toPhase.isActive) {
      throw new AppError('La fase di destinazione non e valida.', 400)
    }

    const phaseData = (input.phaseData as JsonObject | undefined) ?? {}

    await assertPhaseDataIsValid(transition.toPhaseId, phaseData)

    const mergedCustomData: JsonObject = {
      ...(toJsonObject(practice.customData) ?? {}),
      ...phaseData,
    }

    await updatePracticePhase({
      customData: mergedCustomData as Prisma.InputJsonValue,
      id: practice.id,
      toPhaseId: transition.toPhaseId,
    })

    await createPhaseChangedHistoryEvent({
      data: {
        phaseData,
        transitionId: transition.id,
        transitionLabel: transition.actionLabel,
        ...(input.occurredAt ? { occurredAt: input.occurredAt.toISOString() } : {}),
      },
      description: input.notes ?? null,
      fromPhaseId: practice.currentPhaseId,
      practiceId: practice.id,
      title: transition.actionLabel || 'Fase aggiornata',
      toPhaseId: transition.toPhaseId,
    })

    const updated = await findPracticeDetailById(practice.id)

    if (!updated) {
      throw new AppError('Pratica non trovata.', 404)
    }

    return mapPracticeDetail(updated)
  } catch (error: unknown) {
    throw toAppError(error, 'Impossibile avanzare la pratica.')
  }
}
