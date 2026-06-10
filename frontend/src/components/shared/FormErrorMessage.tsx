type FormErrorMessageProps = {
  message: string
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  return <p className="form-error">{message}</p>
}
