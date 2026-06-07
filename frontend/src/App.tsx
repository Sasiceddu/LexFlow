import { MainLayout } from './components/layout/MainLayout'
import { QueryProvider } from './context/QueryProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <QueryProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </QueryProvider>
  )
}

export default App
