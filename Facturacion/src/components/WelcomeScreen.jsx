import { useState } from 'react'
import Logo from './Logo'
import Icon from './Icon'
import { isSoundEnabled, setSoundEnabled, playChime, speak } from '../utils/sound'

function WelcomeScreen({ onComplete }) {
  const [name, setName] = useState('')
  const [soundOn, setSoundOn] = useState(isSoundEnabled)
  const [greeting, setGreeting] = useState(null)

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) playChime()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length === 0) return
    setGreeting(name.trim())
    playChime()
    speak(`¡Bienvenido a Aiden's System, ${name.trim()}!`)
    setTimeout(() => onComplete(name.trim()), 2600)
  }

  if (greeting) {
    return (
      <div className="onboarding">
        <div className="onboard-card welcome-greeting">
          <Logo withWordmark size={54} />
          <div className="greeting-ding">
            <Icon name="sound" size={30} />
          </div>
          <h1>¡Bienvenido, {greeting}!</h1>
          <p className="welcome-subtitle">
            Conectando tu sistema de facturación...
          </p>
          <div className="greeting-bar">
            <span className="greeting-bar-fill" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding welcome">
      <div className="onboard-card">
        <Logo withWordmark size={54} />
        <h1>Bienvenido</h1>
        <p className="welcome-subtitle">
          Aiden&apos;s System te permite facturar, cobrar y gestionar reservas de tu
          negocio. Comencemos por conocerte.
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
            Continuar
          </button>
        </form>

        <button type="button" className="sound-toggle" onClick={toggleSound}>
          <Icon name="sound" size={15} />
          Sonido de bienvenida: {soundOn ? 'activado' : 'desactivado'}
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen