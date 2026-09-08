import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import BusinessNameScreen from './components/BusinessNameScreen'
import BusinessSelect from './components/BusinessSelect'
import AccountSetup from './components/AccountSetup'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { getBusinessType } from './data/businessTypes'

const USERS_KEY = 'aiden-users'
const SESSION_KEY = 'aiden-session'
const SETTINGS_KEY = 'aiden-settings'
const INVENTORY_KEY = 'aiden-inventario'
const INVOICES_KEY = 'aiden-invoices'
const RESERVATIONS_KEY = 'aiden-reservations'

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function App() {
  const [users, setUsers] = useState(loadUsers)
  const [settings, setSettings] = useState(loadSettings)
  const [sessionUser, setSessionUser] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) || ''
    } catch {
      return ''
    }
  })
  const [step, setStep] = useState('welcome') // welcome | empresa | cuenta

  const saveUsers = (next) => {
    setUsers(next)
    localStorage.setItem(USERS_KEY, JSON.stringify(next))
  }

  const saveSettings = (next) => {
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }

  const doLogin = (user) => {
    try {
      sessionStorage.setItem(SESSION_KEY, user.username)
    } catch {
      /* ignore */
    }
    setSessionUser(user.username)
  }

  const doLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
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
        <div className="app-stage">
          <BusinessSelect
            userName={currentUser.nombre || userName}
            onComplete={(biz) => saveSettings({ ...settings, businessId: biz.id })}
          />
        </div>
      )
    }
    return (
      <div className="app-stage">
        <Dashboard
          userName={currentUser.nombre || userName}
          businessName={businessName}
          business={business}
          currentUser={currentUser}
          users={users}
          saveUsers={saveUsers}
          onLogout={doLogout}
        />
      </div>
    )
  }

  // Ya hay cuentas creadas → login.
  if (users.length > 0) {
    return (
      <div className="app-stage">
        <LoginScreen
          users={users}
          onLogin={doLogin}
          onReset={() => {
            setUsers([])
            setSettings({})
            setSessionUser('')
            setStep('welcome')
            try {
              sessionStorage.removeItem(SESSION_KEY)
            } catch {
              /* ignore */
            }
            localStorage.removeItem(USERS_KEY)
            localStorage.removeItem(INVENTORY_KEY)
            localStorage.removeItem(SETTINGS_KEY)
            localStorage.removeItem(INVOICES_KEY)
            localStorage.removeItem(RESERVATIONS_KEY)
          }}
        />
      </div>
    )
  }

  // Primer uso → onboarding.
  switch (step) {
    case 'welcome':
      return (
        <div className="app-stage">
          <WelcomeScreen
            onComplete={(name) => {
              saveSettings({ ...settings, userName: name })
              setStep('empresa')
            }}
          />
        </div>
      )
    case 'empresa':
      return (
        <div className="app-stage">
          <BusinessNameScreen
            onComplete={(name) => {
              saveSettings({ ...settings, businessName: name })
              setStep('cuenta')
            }}
          />
        </div>
      )
    default:
      return (
        <div className="app-stage">
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
        </div>
      )
  }
}

export default App