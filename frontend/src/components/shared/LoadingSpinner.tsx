type LoadingSpinnerProps = {
  label?: string
}

export function LoadingSpinner({ label = 'Caricamento' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="loading-spinner-indicator" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
