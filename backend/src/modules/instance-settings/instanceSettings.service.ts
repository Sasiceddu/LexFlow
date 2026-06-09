import {
  findCollaborators,
  findConfigurableFields,
  findDropdownMenus,
  findDropdownOptions,
  findProfessionals,
  findWorkflowPhases,
  findWorkflowTransitions,
  findWorkflows,
} from './instanceSettings.repository'
import type { InstanceSettingsOverview } from './instanceSettings.types'

export async function getInstanceSettingsOverview(): Promise<InstanceSettingsOverview> {
  const [
    collaborators,
    professionals,
    workflows,
    phases,
    transitions,
    configurableFields,
    dropdownMenus,
    dropdownOptions,
  ] = await Promise.all([
    findCollaborators(),
    findProfessionals(),
    findWorkflows(),
    findWorkflowPhases(),
    findWorkflowTransitions(),
    findConfigurableFields(),
    findDropdownMenus(),
    findDropdownOptions(),
  ])

  return {
    collaborators,
    professionals,
    workflows,
    phases,
    transitions,
    configurableFields,
    dropdownMenus,
    dropdownOptions,
  }
}
