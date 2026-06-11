export const routePaths = {
  dashboard: '/',
  practices: '/pratiche',
  practiceDetail: '/pratiche/:id',
  reports: '/report',
  instanceSettings: '/impostazioni-istanze',
  appSettings: '/impostazioni-app',
  trash: '/cestino',
} as const

export type RoutePath = (typeof routePaths)[keyof typeof routePaths]

export function practiceDetailPath(id: string): string {
  return `/pratiche/${id}`
}
