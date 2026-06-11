export function formatDate(value: string | null, fallback = '-'): string {
  if (!value) {
    return fallback
  }

  return new Intl.DateTimeFormat('it-IT').format(new Date(value))
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatAmount(value: string | null, fallback = '-'): string {
  if (!value) {
    return fallback
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return new Intl.NumberFormat('it-IT', {
    currency: 'EUR',
    style: 'currency',
  }).format(amount)
}

export function formatText(value: string | null, fallback = '-'): string {
  return value && value.trim().length > 0 ? value : fallback
}
