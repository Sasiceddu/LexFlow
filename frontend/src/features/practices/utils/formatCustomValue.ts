import type { JsonValue } from '../../../types/practice.types'

export function formatCustomValue(value: JsonValue): string {
  if (value === null) {
    return 'Non inserito'
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No'
  }

  if (typeof value === 'string') {
    return value.trim().length > 0 ? value : 'Non inserito'
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.length > 0
      ? value.map((item) => formatCustomValue(item)).join(', ')
      : 'Non inserito'
  }

  return JSON.stringify(value)
}
