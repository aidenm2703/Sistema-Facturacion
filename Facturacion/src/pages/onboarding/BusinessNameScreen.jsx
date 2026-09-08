import { useState } from 'react'
import { Logo } from '../../components'

function BusinessNameScreen({ onComplete }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Indica el nombre de tu empresa para continuar.')
      return
    }
    onComplete(name.trim())
  }

  return (
    <div className="onboarding">
      <div className="onboard-card">
        <Logo withWordmark size={54} />
        <h1>Tu empresa</h1>
        <p className="welcome-subtitle">
          ¿Cuál es el nombre de tu empresa o negocio? Lo usaremos en tus facturas y en
          el encabezado del sistema.
        </p>

        <form className="welcome-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="bizName">Nombre de la empresa</label>
          <input
            id="bizName"
            type="text"
            value={name}
            placeholder="Ej.: Restaurante Don Pancho"
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            autoFocus
          />
          {error && <span className="error">{error}</span>}
          <button type="submit" className="btn btn-primary btn-block" disabled={!name.trim()}>
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}

export default BusinessNameScreen