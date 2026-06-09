export const routePaths = {
  dashboard: '/',
  practices: '/pratiche',
  reports: '/report',
  instanceSettings: '/impostazioni-istanze',
  appSettings: '/impostazioni-app',
  trash: '/cestino',
} as const

export type RoutePath = (typeof routePaths)[keyof typeof routePaths]
