import type { InputHTMLAttributes, ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
}

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  const classes = ['ui-checkbox', className].filter(Boolean).join(' ')

  return (
    <label className={classes}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
