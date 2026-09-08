import { useEffect, useState } from 'react'
import Icon from './Icon'

const CONFIG = {
  success: { icon: 'check', className: 'toast-success' },
  info: { icon: 'info', className: 'toast-info' },
  warning: { icon: 'alert', className: 'toast-warning' },
  danger: { icon: 'alert', className: 'toast-danger' },
}

function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (e) => {
      const t = e.detail || {}
      setToasts((list) => [...list, t])
      setTimeout(
        () => setToasts((list) => list.filter((x) => x.id !== t.id)),
        t.duration || 3800,
      )
    }
    window.addEventListener('aiden-toast', handler)
    return () => window.removeEventListener('aiden-toast', handler)
  }, [])

  const close = (id) => setToasts((list) => list.filter((x) => x.id !== id))

  return (
    <div className="toaster">
      {toasts.map((t) => {
        const cfg = CONFIG[t.type] || CONFIG.info
        return (
          <div key={t.id} className={`toast ${cfg.className}`} role="status">
            <span className="toast-icon">
              <Icon name={cfg.icon} size={18} />
            </span>
            <div className="toast-body">
              {t.title && <strong>{t.title}</strong>}
              {t.message && <span>{t.message}</span>}
            </div>
            <button type="button" className="toast-close" onClick={() => close(t.id)}>
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toaster