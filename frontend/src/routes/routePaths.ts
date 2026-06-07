export const routePaths = {
  dashboard: '/',
} as const

export type RoutePath = (typeof routePaths)[keyof typeof routePaths]
