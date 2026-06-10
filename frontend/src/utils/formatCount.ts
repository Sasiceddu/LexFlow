export function formatPluralCount(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function joinCountParts(parts: string[]): string {
  return parts.join(' · ')
}
