type ErrorMessageProps = {
  message: string
  title?: string
}

export function ErrorMessage({
  message,
  title = 'Si è verificato un errore',
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  )
}
