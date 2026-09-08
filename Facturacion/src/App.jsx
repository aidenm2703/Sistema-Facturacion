import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import BusinessSelect from './components/BusinessSelect'
import Dashboard from './components/Dashboard'
import { getBusinessType } from './data/businessTypes'

function App() {
  const [userName, setUserName] = useState('')
  const [business, setBusiness] = useState(null)

  // Si ya eligió nombre pero no negocio, mostramos selección de negocio
  if (!userName) {
    return (
      <div className="app-stage">
        <WelcomeScreen onComplete={setUserName} />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="app-stage">
        <BusinessSelect userName={userName} onComplete={setBusiness} />
      </div>
    )
  }

  return (
    <div className="app-stage">
      <Dashboard
        userName={userName}
        business={getBusinessType(business.id)}
        onChangeBusiness={() => setBusiness(null)}
      />
    </div>
  )
}

export default App
