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

type SeedWorkflowTransition = {
  actionLabel: string
  from: (typeof standardPhases)[number]
  technicalKey: string
  to: (typeof standardPhases)[number]
}

const standardTransitions: SeedWorkflowTransition[] = [
  {
    from: 'Depositata',
    to: 'In attesa di decreto',
    actionLabel: 'Conferma attesa decreto',
    technicalKey: 'deposited_to_waiting_decree',
  },
  {
    from: 'In attesa di decreto',
    to: 'Sollecito effettuato',
    actionLabel: 'Registra sollecito',
    technicalKey: 'waiting_decree_to_reminder',
  },
  {
    from: 'Sollecito effettuato',
    to: 'In attesa di decreto',
    actionLabel: 'Torna in attesa decreto',
    technicalKey: 'reminder_to_waiting_decree',
  },
  {
    from: 'In attesa di decreto',
    to: 'Integrazione richiesta',
    actionLabel: 'Registra integrazione richiesta',
    technicalKey: 'waiting_decree_to_integration_requested',
  },
  {
    from: 'Integrazione richiesta',
    to: 'Integrazione inviata',
    actionLabel: 'Registra integrazione inviata',
    technicalKey: 'integration_requested_to_integration_sent',
  },
  {
    from: 'Integrazione inviata',
    to: 'In attesa di decreto',
    actionLabel: 'Torna in attesa decreto',
    technicalKey: 'integration_sent_to_waiting_decree',
  },
  {
    from: 'In attesa di decreto',
    to: 'Decreto ricevuto',
    actionLabel: 'Registra decreto ricevuto',
    technicalKey: 'waiting_decree_to_decree_received',
  },
  {
    from: 'In attesa di decreto',
    to: 'Rifiutata',
    actionLabel: 'Registra rifiuto',
    technicalKey: 'waiting_decree_to_rejected',
  },
  {
    from: 'In attesa di decreto',
    to: 'Sospesa',
    actionLabel: 'Sospendi pratica',
    technicalKey: 'waiting_decree_to_suspended',
  },
  {
    from: 'Sospesa',
    to: 'In attesa di decreto',
    actionLabel: 'Riattiva pratica',
    technicalKey: 'suspended_to_waiting_decree',
  },
  {
    from: 'In attesa di decreto',
    to: 'Annullata',
    actionLabel: 'Annulla pratica',
    technicalKey: 'waiting_decree_to_cancelled',
  },
  {
    from: 'Decreto ricevuto',
    to: 'Decreto inviato a SCP',
    actionLabel: 'Registra invio SCP',
    technicalKey: 'decree_received_to_sent_scp',
  },
  {
    from: 'Decreto ricevuto',
    to: 'Sospesa',
    actionLabel: 'Sospendi pratica',
    technicalKey: 'decree_received_to_suspended',
  },
  {
    from: 'Decreto ricevuto',
    to: 'Annullata',
    actionLabel: 'Annulla pratica',
    technicalKey: 'decree_received_to_cancelled',
  },
  {
    from: 'Decreto inviato a SCP',
    to: 'In attesa di liquidazione SCP',
    actionLabel: 'Conferma attesa liquidazione SCP',
    technicalKey: 'sent_scp_to_waiting_scp_payment',
  },
  {
    from: 'In attesa di liquidazione SCP',
    to: 'Liquidata',
    actionLabel: 'Registra liquidazione',
    technicalKey: 'waiting_scp_payment_to_paid',
  },
  {
    from: 'Liquidata',
    to: 'Chiusa',
    actionLabel: 'Chiudi pratica',
    technicalKey: 'paid_to_closed',
  },
]

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

  const phases = await Promise.all(
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

  const phaseByName = new Map(
    phases.map((phase) => [phase.name, phase] as const),
  )

  await Promise.all(
    standardTransitions.map((transition, index) => {
      const fromPhase = phaseByName.get(transition.from)
      const toPhase = phaseByName.get(transition.to)

      if (!fromPhase || !toPhase) {
        throw new Error(`Missing phase for transition ${transition.technicalKey}`)
      }

      return prisma.workflowTransition.upsert({
        where: {
          workflowId_technicalKey: {
            workflowId: workflow.id,
            technicalKey: transition.technicalKey,
          },
        },
        update: {
          fromPhaseId: fromPhase.id,
          toPhaseId: toPhase.id,
          actionLabel: transition.actionLabel,
          order: index + 1,
          isActive: true,
        },
        create: {
          workflowId: workflow.id,
          fromPhaseId: fromPhase.id,
          toPhaseId: toPhase.id,
          actionLabel: transition.actionLabel,
          technicalKey: transition.technicalKey,
          order: index + 1,
          isActive: true,
        },
      })
    }),
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
