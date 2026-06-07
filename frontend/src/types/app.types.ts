export type AppStatus = 'idle' | 'loading' | 'ready' | 'error'

export type NavigationItem = {
  isActive?: boolean
  label: string
  path: string
}
