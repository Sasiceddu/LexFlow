import type { ReactNode, SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode
}

export function Select({ children, className, ...props }: SelectProps) {
  const classes = ['ui-input', className].filter(Boolean).join(' ')

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  )
}
