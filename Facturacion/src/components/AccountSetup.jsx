import { useState } from 'react'
import Logo from './Logo'

function AccountSetup({ userName, onComplete }) {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (form.username.trim().length < 3) errs.username = 'El usuario debe tener al menos 3 caracteres'
    if (form.password.length < 6) errs.password = 'La contraseña debe tener al menos 6 caracteres'
    if (form.confirm !== form.password) errs.confirm = 'Las contraseñas no coinciden'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onComplete({
      username: form.username.trim(),
      password: form.password,
      nombre: userName,
    })
  }

  return (
    <div className="onboarding">
      <div className="onboard-card">
        <Logo withWordmark size={54} />
        <h1>Cuenta de administrador</h1>
        <p className="welcome-subtitle">
          Crea tu usuario y contraseña de administrador. Con esta cuenta podrás crear
          empleados y decidir qué acciones puede realizar cada uno.
        </p>

        <form className="welcome-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={form.username}
            placeholder="Ej.: admin"
            onChange={(e) => setField('username', e.target.value)}
            autoFocus
          />
          {errors.username && <span className="error">{errors.username}</span>}

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={form.password}
            placeholder="Mínimo 6 caracteres"
            onChange={(e) => setField('password', e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <label htmlFor="confirm">Confirmar contraseña</label>
          <input
            id="confirm"
            type="password"
            value={form.confirm}
            placeholder="Repite la contraseña"
            onChange={(e) => setField('confirm', e.target.value)}
          />
          {errors.confirm && <span className="error">{errors.confirm}</span>}

          <button type="submit" className="btn btn-primary btn-block">
            Crear cuenta de administrador
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccountSetup