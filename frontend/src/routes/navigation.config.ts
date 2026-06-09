import { routePaths, type RoutePath } from './routePaths'

export type NavigationItemConfig = {
  label: string
  path: RoutePath
}

export const navigationItems: NavigationItemConfig[] = [
  {
    label: 'Dashboard',
    path: routePaths.dashboard,
  },
  {
    label: 'Pratiche',
    path: routePaths.practices,
  },
  {
    label: 'Report',
    path: routePaths.reports,
  },
  {
    label: 'Impostazioni istanze',
    path: routePaths.instanceSettings,
  },
  {
    label: 'Impostazioni app',
    path: routePaths.appSettings,
  },
  {
    label: 'Cestino',
    path: routePaths.trash,
  },
]
