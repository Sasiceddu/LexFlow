import { HashRouter } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { QueryProvider } from './context/QueryProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <QueryProvider>
      <HashRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </HashRouter>
    </QueryProvider>
  )
}

export default App
