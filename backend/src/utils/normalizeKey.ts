export function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function normalizeTechnicalKey(label: string, technicalKey?: string): string {
  const normalized = technicalKey?.trim()

  return normalized && normalized.length > 0
    ? normalizeKey(normalized)
    : normalizeKey(label)
}
