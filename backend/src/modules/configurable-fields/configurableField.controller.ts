import type { Request, Response } from 'express'
import {
  addConfigurableField,
  editConfigurableField,
  listConfigurableFields,
  removeConfigurableField,
} from './configurableField.service'
import { getParam } from '../../utils/requestParams'

export async function getConfigurableFields(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await listConfigurableFields())
}

export async function postConfigurableField(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addConfigurableField(request.body))
}

export async function patchConfigurableField(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await editConfigurableField(
      getParam(request, 'id', 'Identificativo campo'),
      request.body,
    ),
  )
}

export async function deleteConfigurableField(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await removeConfigurableField(getParam(request, 'id', 'Identificativo campo')),
  )
}
