import { prisma } from '../src/database/prismaClient'

const STANDARD_WORKFLOW_NAME = 'Workflow istanze di liquidazione'

const standardPhases = [
  'Depositata',
  'In attesa di decreto',
  'Sollecito effettuato',
  'Integrazione richiesta',
  'Integrazione inviata',
  'Rifiutata',
  'Decreto ricevuto',
  'Decreto inviato a SCP',
  'In attesa di liquidazione SCP',
  'Liquidata',
  'Chiusa',
  'Sospesa',
  'Annullata',
] as const

type SeedDropdownOption = {
  label: string
  triggersPecBlock?: boolean
  value: string
}

type SeedDropdownMenu = {
  name: string
  options: SeedDropdownOption[]
  technicalKey: string
}

const standardMenus: SeedDropdownMenu[] = [
  {
    name: 'Tipologia attività',
    technicalKey: 'tipologia_attivita',
    options: [
      { label: 'Interrogatorio', value: 'interrogatorio' },
      { label: 'Processo', value: 'processo' },
    ],
  },
  {
    name: 'Modalità deposito',
    technicalKey: 'modalita_deposito',
    options: [
      { label: 'PEC', value: 'pec', triggersPecBlock: true },
      { label: 'Deposito a mano', value: 'deposito_a_mano' },
    ],
  },
  {
    name: 'Modalità invio SCP',
    technicalKey: 'modalita_invio_scp',
    options: [
      { label: 'PEC', value: 'pec', triggersPecBlock: true },
      { label: 'Raccomandata', value: 'raccomandata' },
    ],
  },
] as const

function toTechnicalKey(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

async function seedWorkflow(): Promise<void> {
  const workflow = await prisma.workflow.upsert({
    where: {
      name: STANDARD_WORKFLOW_NAME,
    },
    update: {
      isDefault: true,
      isActive: true,
    },
    create: {
      name: STANDARD_WORKFLOW_NAME,
      description: 'Workflow standard per istanze di liquidazione.',
      isDefault: true,
      isActive: true,
    },
  })

  await Promise.all(
    standardPhases.map((phaseName, index) =>
      prisma.workflowPhase.upsert({
        where: {
          workflowId_technicalKey: {
            workflowId: workflow.id,
            technicalKey: toTechnicalKey(phaseName),
          },
        },
        update: {
          name: phaseName,
          order: index + 1,
          isInitial: index === 0,
          isFinal: ['Chiusa', 'Annullata'].includes(phaseName),
          isActive: true,
          deletedAt: null,
        },
        create: {
          workflowId: workflow.id,
          name: phaseName,
          technicalKey: toTechnicalKey(phaseName),
          category: 'standard',
          order: index + 1,
          isInitial: index === 0,
          isFinal: ['Chiusa', 'Annullata'].includes(phaseName),
          isActive: true,
        },
      }),
    ),
  )
}

async function seedDropdownMenus(): Promise<void> {
  for (const menuConfig of standardMenus) {
    const menu = await prisma.dropdownMenu.upsert({
      where: {
        technicalKey: menuConfig.technicalKey,
      },
      update: {
        name: menuConfig.name,
        isSystem: true,
        isActive: true,
      },
      create: {
        name: menuConfig.name,
        technicalKey: menuConfig.technicalKey,
        isSystem: true,
        isActive: true,
      },
    })

    await Promise.all(
      menuConfig.options.map((option, index) =>
        prisma.dropdownOption.upsert({
          where: {
            menuId_value: {
              menuId: menu.id,
              value: option.value,
            },
          },
          update: {
            label: option.label,
            order: index + 1,
            triggersPecBlock: option.triggersPecBlock ?? option.value === 'pec',
            isActive: true,
            deletedAt: null,
          },
          create: {
            menuId: menu.id,
            label: option.label,
            value: option.value,
            order: index + 1,
            triggersPecBlock: option.triggersPecBlock ?? option.value === 'pec',
            isActive: true,
          },
        }),
      ),
    )
  }
}

async function main(): Promise<void> {
  await seedWorkflow()
  await seedDropdownMenus()
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
