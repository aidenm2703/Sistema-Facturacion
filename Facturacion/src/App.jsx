import { useState } from 'react'
import './App.css'
import { Toaster } from './components'
import { BusinessSelect, LoginScreen, Dashboard } from './pages'
import { onboardingSteps } from './routes'
import { getBusinessType } from './data'

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

function AppRoot({ children }) {
  return (
    <div className="app-stage">
      <Toaster />
      {children}
    </div>
  )
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
      </AppRoot>
    )
  }

  // Primer uso → onboarding guiado por las rutas registradas.
  const stepConfig = onboardingSteps.find((s) => s.id === step) || onboardingSteps[0]
  const StepScreen = stepConfig.Component
  if (step === 'welcome') {
    return (
      <AppRoot>
        <StepScreen
          onComplete={(name) => {
            saveSettings({ ...settings, userName: name })
            setStep('empresa')
          }}
        />
      </AppRoot>
    )
  }
  if (step === 'empresa') {
    return (
      <AppRoot>
        <StepScreen
          onComplete={(name) => {
            saveSettings({ ...settings, businessName: name })
            setStep('cuenta')
          }}
        />
      </AppRoot>
    )
  }
  return (
    <AppRoot>
      <StepScreen
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

export default App