export function toOptionalText(value: string): string | null {
  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}
