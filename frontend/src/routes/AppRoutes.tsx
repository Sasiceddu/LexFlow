import { Route, Routes } from 'react-router-dom'
import { AppSettingsPage } from '../pages/AppSettingsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { InstanceSettingsPage } from '../pages/InstanceSettingsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PracticesPage } from '../pages/PracticesPage'
import { ReportsPage } from '../pages/ReportsPage'
import { TrashPage } from '../pages/TrashPage'
import { routePaths } from './routePaths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={routePaths.dashboard} element={<DashboardPage />} />
      <Route path={routePaths.practices} element={<PracticesPage />} />
      <Route path={routePaths.reports} element={<ReportsPage />} />
      <Route
        path={routePaths.instanceSettings}
        element={<InstanceSettingsPage />}
      />
      <Route path={routePaths.appSettings} element={<AppSettingsPage />} />
      <Route path={routePaths.trash} element={<TrashPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
