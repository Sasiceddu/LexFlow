import type { Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import {
  addDropdownMenu,
  addDropdownOption,
  editDropdownMenu,
  editDropdownOption,
  listDropdownMenus,
  listDropdownOptions,
  removeDropdownMenu,
  removeDropdownOption,
} from './dropdownMenu.service'

function getParam(request: Request, key: string, label: string): string {
  const value = request.params[key]

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(`${label} non valido.`, 400)
  }

  return value
}

export async function getDropdownMenus(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await listDropdownMenus())
}

export async function postDropdownMenu(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addDropdownMenu(request.body))
}

export async function patchDropdownMenu(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await editDropdownMenu(getParam(request, 'id', 'Identificativo menu'), request.body),
  )
}

export async function deleteDropdownMenu(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removeDropdownMenu(getParam(request, 'id', 'Identificativo menu')))
}

export async function getDropdownOptions(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await listDropdownOptions(
      getParam(request, 'menuId', 'Identificativo menu'),
    ),
  )
}

export async function postDropdownOption(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(
    await addDropdownOption(
      getParam(request, 'menuId', 'Identificativo menu'),
      request.body,
    ),
  )
}

export async function patchDropdownOption(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await editDropdownOption(
      getParam(request, 'id', 'Identificativo opzione'),
      request.body,
    ),
  )
}

export async function deleteDropdownOption(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await removeDropdownOption(getParam(request, 'id', 'Identificativo opzione')),
  )
}
