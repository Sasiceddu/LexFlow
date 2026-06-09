import { Link } from 'react-router-dom'
import { useNavigationItems } from '../../hooks/useNavigationItems'

export function Sidebar() {
  const items = useNavigationItems()

  return (
    <aside className="sidebar" aria-label="Navigazione principale">
      <div className="sidebar-brand">
        <span className="sidebar-logo">LF</span>
        <div>
          <strong>LexFlow</strong>
          <span>Desktop locale</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <Link
            aria-current={item.isActive ? 'page' : undefined}
            className={item.isActive ? 'sidebar-link active' : 'sidebar-link'}
            key={item.path}
            to={item.path}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
