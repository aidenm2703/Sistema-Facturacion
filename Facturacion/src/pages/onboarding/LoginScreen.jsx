import { useRef, useState } from 'react'
import { Logo } from '../../components'
import { Icon } from '../../components'
import { toast } from '../../utils'

function LoginScreen({ users, onLogin, onReset }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [confirmingReset, setConfirmingReset] = useState(false)
  const resetTimer = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = users.find(
      (u) => u.username.toLowerCase() === form.username.trim().toLowerCase(),
    )
    if (!user || user.password !== form.password) {
      setError('Usuario o contraseña incorrectos.')
      return
    }
    onLogin(user)
  }

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true)
      toast.warning('Restablecer sistema', 'Pulsa de nuevo para confirmar que se borrarán todos los datos.')
      resetTimer.current = setTimeout(() => setConfirmingReset(false), 3500)
      return
    }
    setConfirmingReset(false)
    clearTimeout(resetTimer.current)
    onReset()
  }

  return (
    <div className="onboarding">
      <div className="onboard-card">
        <Logo withWordmark size={58} />
        <h1>Iniciar sesión</h1>
        <p className="welcome-subtitle">
          Ingresa con tu usuario y contraseña para acceder al sistema.
        </p>

        <form className="welcome-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="loginUser">Usuario</label>
          <input
            id="loginUser"
            type="text"
            value={form.username}
            placeholder="Usuario"
            onChange={(e) => {
              setForm((f) => ({ ...f, username: e.target.value }))
              if (error) setError('')
            }}
            autoFocus
          />
          <label htmlFor="loginPass">Contraseña</label>
          <input
            id="loginPass"
            type="password"
            value={form.password}
            placeholder="Contraseña"
            onChange={(e) => {
              setForm((f) => ({ ...f, password: e.target.value }))
              if (error) setError('')
            }}
          />
          {error && <span className="error">{error}</span>}
          <button type="submit" className="btn btn-primary btn-block">
            Ingresar
          </button>
        </form>

        <button
          type="button"
          className={`link-btn ${confirmingReset ? 'link-btn-danger' : ''}`}
          onClick={handleReset}
        >
          {confirmingReset ? (
            <>
              <Icon name="alert" size={14} /> ¿Seguro? Pulsa de nuevo para restablecer
            </>
          ) : (
            '¿Olvidaste tu acceso? Restablecer sistema'
          )}
        </button>
      </div>
    </div>
  )
}

export default LoginScreen