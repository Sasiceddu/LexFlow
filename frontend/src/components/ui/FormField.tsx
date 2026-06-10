import type { ReactNode } from 'react'

type FormFieldProps = {
  children: ReactNode
  error?: string | null
  label: string
}

export function FormField({ children, error, label }: FormFieldProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error ? <span className="form-field-error">{error}</span> : null}
    </label>
  )
}
