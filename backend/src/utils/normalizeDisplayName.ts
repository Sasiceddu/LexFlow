export function normalizeDisplayName(
  firstName: string,
  lastName: string,
  displayName?: string,
): string {
  const normalized = displayName?.trim()

  return normalized && normalized.length > 0
    ? normalized
    : `${firstName.trim()} ${lastName.trim()}`.trim()
}
