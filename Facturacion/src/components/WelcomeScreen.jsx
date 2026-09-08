import { useState } from 'react'

function WelcomeScreen({ onComplete }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length === 0) return
    onComplete(name.trim())
  }

  return (
    <div className="onboarding welcome">
      <div className="welcome-emoji">🧾</div>
      <h1>Facturador Express</h1>
      <p className="welcome-subtitle">
        Tu sistema de facturación, pagos y reservas en un solo lugar.
      </p>

      <form className="welcome-form" onSubmit={handleSubmit}>
        <label htmlFor="userName">¿Cómo te llamas?</label>
        <input
          id="userName"
          type="text"
          value={name}
          placeholder="Escribe tu nombre..."
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={!name.trim()}>
          Comenzar →
        </button>
      </form>
    </div>
  )
}

export default WelcomeScreen
