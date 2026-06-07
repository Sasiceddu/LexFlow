import { PageContainer } from '../components/layout/PageContainer'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { useBackendHealth } from '../hooks/useBackendHealth'

export function DashboardPage() {
  const { data, error, isPending } = useBackendHealth()
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Impossibile verificare il backend locale.'

  return (
    <PageContainer title="LexFlow" description="Struttura desktop locale pronta.">
      <div className="status-panel">
        <p>
          Frontend, backend locale ed Electron sono collegati tramite un layer
          API centralizzato.
        </p>

        {isPending ? (
          <LoadingSpinner label="Verifica del backend locale" />
        ) : null}

        {error ? (
          <ErrorMessage
            title="Backend non raggiungibile"
            message={errorMessage}
          />
        ) : null}

        {data ? (
          <div className="status-card" aria-label="Stato backend locale">
            <div>
              <span>Applicazione</span>
              <strong>{data.app}</strong>
            </div>
            <div>
              <span>Backend</span>
              <strong>{data.status}</strong>
            </div>
            <div>
              <span>Modalita</span>
              <strong>{data.mode}</strong>
            </div>
            <div>
              <span>Database</span>
              <strong>{data.database?.status ?? 'non disponibile'}</strong>
            </div>
          </div>
        ) : null}
      </div>
    </PageContainer>
  )
}
