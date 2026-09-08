import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import BusinessNameScreen from './components/BusinessNameScreen'
import BusinessSelect from './components/BusinessSelect'
import AccountSetup from './components/AccountSetup'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import Toaster from './components/Toaster'
import { getBusinessType } from './data/businessTypes'
import { usuarioService } from './services/usuarioService'

function AppRoot({ children }) {
  return (
    <div className="app-stage">
      <Toaster />
      {children}
    </div>
  )
}

function App() {
  const [users, setUsers] = useState(() => usuarioService.obtenerTodos())
  const [settings, setSettings] = useState(() => usuarioService.obtenerSettings())
  const [sessionUser, setSessionUser] = useState(() => usuarioService.sesionActiva())
  const [step, setStep] = useState('welcome') // welcome | empresa | cuenta

  const saveUsers = (next) => {
    const stored = usuarioService.guardarTodos(next)
    setUsers(stored)
  }

  const saveSettings = (next) => {
    const stored = usuarioService.guardarSettings(next)
    setSettings(stored)
  }

  const doLogin = (user) => {
    usuarioService.iniciarSesion(user.username)
    setSessionUser(user.username)
  }

  const doLogout = () => {
    usuarioService.cerrarSesion()
    setSessionUser('')
  }

  const userName = settings.userName || ''
  const businessName = settings.businessName || ''
  const business = settings.businessId ? getBusinessType(settings.businessId) : null

  const currentUser = users.find((u) => u.username === sessionUser) || null

  // Sesión activa → dashboard (o selección de negocio si falta).
  if (currentUser) {
    if (!business) {
return (
      <AppRoot>
        <BusinessSelect
          userName={currentUser.nombre || userName}
          onComplete={(biz) => saveSettings({ ...settings, businessId: biz.id })}
        />
      </AppRoot>
    )
  }
  return (
    <AppRoot>
      <Dashboard
        userName={currentUser.nombre || userName}
        businessName={businessName}
        business={business}
        currentUser={currentUser}
        users={users}
        saveUsers={saveUsers}
        onLogout={doLogout}
      />
    </AppRoot>
  )
}

  // Ya hay cuentas creadas → login.
  if (users.length > 0) {
    return (
      <AppRoot>
        <LoginScreen
          users={users}
          onLogin={doLogin}
          onReset={() => {
            setUsers([])
            setSettings({})
            setSessionUser('')
            setStep('welcome')
            usuarioService.cerrarSesion()
            localStorage.removeItem('aiden-users')
            localStorage.removeItem('aiden-inventario')
            localStorage.removeItem('aiden-settings')
            localStorage.removeItem('aiden-invoices')
            localStorage.removeItem('aiden-reservations')
          }}
        />
      </AppRoot>
    )
  }

  // Primer uso → onboarding.
  switch (step) {
    case 'welcome':
      return (
        <AppRoot>
          <WelcomeScreen
            onComplete={(name) => {
              saveSettings({ ...settings, userName: name })
              setStep('empresa')
            }}
          />
        </AppRoot>
      )
    case 'empresa':
      return (
        <AppRoot>
          <BusinessNameScreen
            onComplete={(name) => {
              saveSettings({ ...settings, businessName: name })
              setStep('cuenta')
            }}
          />
        </AppRoot>
      )
    default:
      return (
        <AppRoot>
          <AccountSetup
            userName={settings.userName || ''}
            onComplete={({ username, password, nombre }) => {
              const admin = {
                username,
                password,
                nombre,
                role: 'admin',
                permisos: {
                  facturar: true,
                  cobrar: true,
                  inventario: true,
                  reservas: true,
                  panel: true,
                },
              }
              saveUsers([admin])
              doLogin(admin)
            }}
          />
        </AppRoot>
      )
  }
}

export default App