import { useLocation } from 'react-router-dom'
import { navigationItems } from '../routes/navigation.config'
import { routePaths } from '../routes/routePaths'

export function useNavigationItems() {
  const location = useLocation()

  return navigationItems.map((item) => {
    const isActive =
      item.path === routePaths.dashboard
        ? location.pathname === routePaths.dashboard
        : location.pathname.startsWith(item.path)

    return {
      ...item,
      isActive,
    }
  })
}
