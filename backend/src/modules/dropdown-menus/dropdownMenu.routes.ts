import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  deleteDropdownMenu,
  deleteDropdownOption,
  getDropdownMenus,
  getDropdownOptions,
  patchDropdownMenu,
  patchDropdownOption,
  postDropdownMenu,
  postDropdownOption,
} from './dropdownMenu.controller'

export const dropdownMenuRouter = Router()
export const dropdownOptionRouter = Router()

dropdownMenuRouter.get('/', asyncHandler(getDropdownMenus))
dropdownMenuRouter.post('/', asyncHandler(postDropdownMenu))
dropdownMenuRouter.get('/:menuId/options', asyncHandler(getDropdownOptions))
dropdownMenuRouter.post('/:menuId/options', asyncHandler(postDropdownOption))
dropdownMenuRouter.patch('/:id', asyncHandler(patchDropdownMenu))
dropdownMenuRouter.delete('/:id', asyncHandler(deleteDropdownMenu))

dropdownOptionRouter.patch('/:id', asyncHandler(patchDropdownOption))
dropdownOptionRouter.delete('/:id', asyncHandler(deleteDropdownOption))
