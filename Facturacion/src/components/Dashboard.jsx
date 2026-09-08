import { useState } from 'react'
import InvoiceForm from './InvoiceForm'
import InvoiceList from './InvoiceList'
import Invoice from './Invoice'
import Payments from './Payments'
import Reservations from './Reservations'
import CalendarView from './CalendarView'
import AdminDashboard from './AdminDashboard'

const STORAGE_KEY = 'facturador-invoices'

const exampleInvoice = {
  id: 'inv-1001',
  emisor: 'TechStore S.A.',
  RUC: '20123456789',
  direccionEmpresa: 'Av. Tecnología 456',
  correoEmpresa: 'ventas@techstore.com',
  cliente: 'Juan Pérez',
  direccionCliente: 'Calle Los Álamos 230',
  correoCliente: 'juan.perez@gmail.com',
  numero: 'FACT-001',
  fecha: new Date().toISOString().slice(0, 10),
  impuesto: 18,
  items: [
    { descripcion: 'Teclado mecánico', cantidad: 2, precio: 25 },
    { descripcion: 'Monitor 24"', cantidad: 1, precio: 180 },
    { descripcion: 'Mouse inalámbrico', cantidad: 3, precio: 12 },
  ],
}

// Dataset de prueba para validar el dashboard administrativo (analítica).
function buildTestDataset() {
  const hoy = new Date()
  const iso = (d) => d.toISOString().slice(0, 10)
  const hace = (dias) => {
    const d = new Date(hoy)
    d.setDate(d.getDate() - dias)
    return iso(d)
  }
  const dentro = (dias) => {
    const d = new Date(hoy)
    d.setDate(d.getDate() + dias)
    return iso(d)
  }

  const clientes = [
    'Carlos Gómez',
    'María López',
    'Ana Ruiz',
    'Pedro Sánchez',
    'Laura Díaz',
    'Jorge Torres',
    'Lucía Fernández',
    'Roberto Castro',
  ]
  const totales = [180, 210, 195, 2450, 220, 175, 205, 190]

  // Fechas de vencimiento: al menos 2 vencidas, 1 pendiente (hoy o futura) y resto pagada.
  // Vencidas: facturas que ya pasaron su vencimiento. Usamos vencimiento ya pasado para 2.
  const inv = totales.map((total, i) => {
    let venc = dentro(30)
    let pagada = true
    if (i === 0 || i === 1) {
      // 2 vencidas: vencimiento en el pasado, sin pagar
      venc = hace(10)
      pagada = false
    } else if (i === 2) {
      // 1 pendiente (sin vencer aún), sin pagar
      venc = dentro(15)
      pagada = false
    }
    return computeTotals({
      id: 'inv-test-' + (i + 1),
      emisor: 'TechStore S.A.',
      RUC: '20123456789',
      direccionEmpresa: 'Av. Tecnología 456',
      correoEmpresa: 'ventas@techstore.com',
      cliente: clientes[i],
      direccionCliente: '',
      correoCliente: '',
      numero: 'TEST-' + String(i + 1).padStart(3, '0'),
      fecha: hace(30 - i * 2),
      fechaVencimiento: venc,
      impuesto: 10,
      pagada,
      items: [
        { descripcion: 'Producto TechStore', cantidad: 1, precio: total / 1.1 },
      ],
    })
  })
  return inv
}

function computeTotals(inv) {
  const subtotal = (inv.items || []).reduce(
    (acc, it) => acc + Number(it.cantidad) * Number(it.precio),
    0,
  )
  const impTotal = subtotal * ((Number(inv.impuesto) || 0) / 100)
  return { ...inv, subtotal, impTotal, total: Math.round((subtotal + impTotal) * 100) / 100 }
}

function loadInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length > 0)
        return list.map((i) => ({ ...computeTotals(i), fechaVencimiento: i.fechaVencimiento }))
    }
  } catch {
    /* ignore */
  }
  return [computeTotals({ ...exampleInvoice, fechaVencimiento: undefined })]
}

// Propuesta: vencimiento por defecto a 30 días si no se asignó.
function withDefaultDue(inv) {
  if (inv.fechaVencimiento) return inv
  const d = new Date(inv.fecha)
  d.setDate(d.getDate() + 30)
  return { ...inv, fechaVencimiento: d.toISOString().slice(0, 10) }
}

function Dashboard({ userName, business, onChangeBusiness }) {
  const [invoices, setInvoices] = useState(loadInvoices)
  const [view, setView] = useState('home') // home | create | invoices | detail | payments | reservations | calendar | admin
  const [selected, setSelected] = useState(null)
  const [reservations, setReservations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('facturador-reservations') || '[]')
    } catch {
      return []
    }
  })

  const nextNumber = invoices.length + 1

  const markPaid = (id) => {
    const next = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, pagada: true }
        : inv,
    )
    persistInvoices(next)
  }

  const persistInvoices = (next) => {
    setInvoices(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const saveInvoice = (data) => {
    const inv = withDefaultDue(computeTotals({ id: 'inv-' + Date.now(), ...data }))
    const next = [inv, ...invoices]
    persistInvoices(next)
    setSelected(inv)
    setView('detail')
  }

  const selectInvoice = (inv) => {
    setSelected(inv)
    setView('detail')
  }

  const viewFromAdmin = (inv) => {
    setSelected(inv)
    setView('detail')
  }

  const saveReservation = (res) => {
    const next = [res, ...reservations]
    setReservations(next)
    localStorage.setItem('facturador-reservations', JSON.stringify(next))
    return next.length
  }
  const updateReservations = (res) => {
    setReservations(res)
    localStorage.setItem('facturador-reservations', JSON.stringify(res))
  }

  const loadTestDataset = () => {
    persistInvoices(buildTestDataset())
    setView('admin')
    alert('Se cargaron 8 facturas de prueba de TechStore S.A. para validar el dashboard administrativo.')
  }

  const navItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'create', label: 'Nueva factura', icon: '➕' },
    { id: 'invoices', label: 'Mis facturas', icon: '🧾' },
    { id: 'payments', label: 'Pagos', icon: '💳' },
    { id: 'reservations', label: 'Reservas', icon: '📅' },
    { id: 'calendar', label: 'Calendario', icon: '🗓️' },
    { id: 'admin', label: 'Panel Admin', icon: '📊' },
  ]

  const renderContent = () => {
    switch (view) {
      case 'create':
        return (
          <InvoiceForm
            business={business}
            nextInvoiceNumber={nextNumber}
            onSave={saveInvoice}
            onCancel={() => setView('invoices')}
          />
        )
      case 'invoices':
        return (
          <InvoiceList
            invoices={invoices}
            onSelect={selectInvoice}
            onNew={() => setView('create')}
          />
        )
      case 'detail':
        return selected && <Invoice invoice={selected} onBack={() => setView('invoices')} />
      case 'payments':
        return <Payments invoices={invoices} onPayInvoice={markPaid} />
      case 'reservations':
        return (
          <Reservations
            businessName={business.name}
            reservations={reservations}
            onAdd={saveReservation}
            onRemove={(id) => updateReservations(reservations.filter((r) => r.id !== id))}
            onGoCalendar={() => setView('calendar')}
          />
        )
      case 'calendar':
        return (
          <CalendarView
            reservations={reservations}
            onRemove={(id) => updateReservations(reservations.filter((r) => r.id !== id))}
          />
        )
      case 'admin':
        return (
          <AdminDashboard
            invoices={invoices}
            onViewInvoice={viewFromAdmin}
            onLoadTestData={loadTestDataset}
          />
        )
      default:
        return (
          <div className="home-content">
            <div className="home-hero">
              <h2>
                Hola, {userName} 👋
              </h2>
              <p className="subtitle">
                Bienvenido a {business.icon} {business.name}. Elige una opción del menú
                para empezar.
              </p>
            </div>
            <div className="quick-grid">
              <button className="quick-card" onClick={() => setView('create')}>
                <span className="quick-icon">➕</span>
                <strong>Nueva factura</strong>
                <span>Crea y emite una factura</span>
              </button>
              <button className="quick-card" onClick={() => setView('invoices')}>
                <span className="quick-icon">🧾</span>
                <strong>Mis facturas</strong>
                <span>Lista y diseño de facturas</span>
              </button>
              <button className="quick-card" onClick={() => setView('reservations')}>
                <span className="quick-icon">📅</span>
                <strong>Reservas</strong>
                <span>Gestiona reservas de clientes</span>
              </button>
              <button className="quick-card" onClick={() => setView('admin')}>
                <span className="quick-icon">📊</span>
                <strong>Panel Admin</strong>
                <span>Métricas y gráficos del negocio</span>
              </button>
            </div>
            {invoices.length <= 1 && (
              <div className="test-data-card">
                <h3>🧪 Dataset de prueba (Reto analítico)</h3>
                <p>
                  Carga las <strong>8 facturas de TechStore S.A.</strong> del ejercicio
                  para validar el dashboard administrativo: detección de la factura
                  atípica de $2,450 y el conteo de estados (vencidas, pendientes y
                  pagadas).
                </p>
                <button type="button" className="btn btn-primary" onClick={loadTestDataset}>
                  Cargar dataset de prueba
                </button>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">{business.icon}</span>
          <div>
            <strong>{business.name}</strong>
            <span className="sidebar-user">{userName}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="btn btn-ghost btn-block" onClick={onChangeBusiness}>
            Cambiar negocio
          </button>
        </div>
      </aside>

      <main className="dash-main">{renderContent()}</main>
    </div>
  )
}

export default Dashboard
