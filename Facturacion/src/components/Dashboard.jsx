import { useState } from 'react'
import Logo from './Logo'
import Icon from './Icon'
import InvoiceForm from './InvoiceForm'
import InvoiceList from './InvoiceList'
import Invoice from './Invoice'
import Payments from './Payments'
import Reservations from './Reservations'
import CalendarView from './CalendarView'
import Inventory from './Inventory'
import AdminDashboard from './AdminDashboard'
import UsersManager from './UsersManager'
import AboutScreen from './AboutScreen'
import HelpScreen from './HelpScreen'
import BusinessMark from './BusinessMark'
import { formatColones } from '../utils/currency'
import { toast } from '../utils/toast'
import { facturaService } from '../services/facturaService'
import { reservaService } from '../services/reservaService'
import { inventarioService } from '../services/inventarioService'

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
  const totales = [93600, 109200, 101400, 1274000, 114400, 91000, 106600, 98800]

  return totales.map((total, i) => {
    let venc = dentro(30)
    let pagada = true
    if (i === 0 || i === 1) {
      venc = hace(10)
      pagada = false
    } else if (i === 2) {
      venc = dentro(15)
      pagada = false
    }
    return {
      id: 'inv-test-' + (i + 1),
      emisor: 'TechStore S.A.',
      RUC: '3-101-555000',
      direccionEmpresa: 'Galería Central, San José',
      correoEmpresa: 'ventas@techstore.com',
      cliente: clientes[i],
      direccionCliente: '',
      correoCliente: '',
      numero: 'TEST-' + String(i + 1).padStart(3, '0'),
      fecha: hace(30 - i * 2),
      fechaVencimiento: venc,
      impuesto: 13,
      pagada,
      items: [{ descripcion: 'Producto TechStore', cantidad: 1, precio: total / 1.13 }],
    }
  })
}

function Dashboard({
  userName,
  businessName,
  business,
  currentUser,
  users,
  saveUsers,
  onLogout,
}) {
  const [invoices, setInvoices] = useState(() => facturaService.obtenerTodas())
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [reservations, setReservations] = useState(() => reservaService.obtenerTodas())
  const [inventory, setInventory] = useState(() => inventarioService.inicializar(business))

  const isAdmin = currentUser.role === 'admin'
  const perm = isAdmin
    ? { facturar: true, cobrar: true, inventario: true, reservas: true, panel: true }
    : currentUser.permisos || {}
  const can = (k) => perm[k] === true

  const catalog = inventory[business.id] || business.items
  const nextNumber = facturaService.siguienteNumero()

  const consumeStock = (itemRows) => {
    const next = inventarioService.descontarStock(business.id, itemRows)
    setInventory(next)
  }

  const saveInvoice = (data) => {
    const inv = facturaService.crear(data)
    setInvoices(facturaService.obtenerTodas())
    consumeStock(data.items)
    setSelected(inv)
    setView('detail')
    toast.success('Factura guardada', `Se guardó la factura ${inv.numero}.`)
  }

  const markPaid = (id) => {
    facturaService.marcarPagada(id)
    setInvoices(facturaService.obtenerTodas())
    toast.success('Pago registrado', 'La factura quedó marcada como pagada.')
  }

  const selectInvoice = (inv) => {
    setSelected(facturaService.obtenerPorId(inv.id) || inv)
    setView('detail')
  }

  const saveReservation = (res) => {
    const created = reservaService.crear(res)
    setReservations(reservaService.obtenerTodas())
    toast.success('Reserva registrada', created.cliente
      ? `Reserva a nombre de ${created.cliente}.`
      : 'La reserva se guardó correctamente.')
  }
  const removeReservation = (id) => {
    reservaService.eliminar(id)
    setReservations(reservaService.obtenerTodas())
  }

  const saveCatalog = (items) => {
    const next = inventarioService.guardarCatalogo(business.id, items)
    if (next === false) {
      toast.danger(
        'Espacio lleno',
        'No se pudieron guardar los cambios. Exporta un respaldo o reduce el tamaño de las fotos.',
      )
      return
    }
    setInventory(next)
  }

  const loadTestDataset = () => {
    facturaService.seed(buildTestDataset())
    setInvoices(facturaService.obtenerTodas())
    setView('panel')
    toast.info(
      'Datos de prueba cargados',
      'Se cargaron las 8 facturas de TechStore S.A. para validar el panel administrativo.',
    )
  }

  const navItems = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    ...(can('facturar')
      ? [
          { id: 'create', label: 'Crear factura', icon: 'create' },
          { id: 'invoices', label: 'Mis facturas', icon: 'invoices' },
        ]
      : []),
    ...(can('cobrar') ? [{ id: 'payments', label: 'Pagos', icon: 'payments' }] : []),
    ...(can('reservas')
      ? [
          { id: 'reservations', label: 'Reservas', icon: 'reservas' },
          { id: 'calendar', label: 'Calendario', icon: 'calendario' },
        ]
      : []),
    ...(can('inventario') ? [{ id: 'inventory', label: 'Inventario', icon: 'inventario' }] : []),
    ...(can('panel') ? [{ id: 'panel', label: 'Panel Admin', icon: 'panel' }] : []),
    ...(isAdmin ? [{ id: 'usuarios', label: 'Usuarios', icon: 'usuarios' }] : []),
    { id: 'about', label: '¿Quiénes somos?', icon: 'info' },
    { id: 'help', label: 'Ayuda', icon: 'help' },
  ]

  const quickActions = [
    can('facturar') && {
      icon: 'create',
      label: 'Crear factura',
      desc: 'Emite una nueva factura',
      go: 'create',
    },
    can('facturar') && {
      icon: 'invoices',
      label: 'Mis facturas',
      desc: 'Lista y diseño de facturas',
      go: 'invoices',
    },
    can('reservas') && {
      icon: 'reservas',
      label: 'Reservas',
      desc: 'Gestiona reservas de clientes',
      go: 'reservations',
    },
    can('inventario') && {
      icon: 'inventario',
      label: 'Inventario',
      desc: 'Consulta productos y existencias',
      go: 'inventory',
    },
    can('panel') && {
      icon: 'panel',
      label: 'Panel Admin',
      desc: 'Métricas y gráficos del negocio',
      go: 'panel',
    },
  ].filter(Boolean)

  const renderContent = () => {
    switch (view) {
      case 'create':
        return can('facturar') ? (
          <InvoiceForm
            business={business}
            businessName={businessName || business.name}
            nextInvoiceNumber={nextNumber}
            catalog={catalog}
            onSave={saveInvoice}
            onCancel={() => setView('invoices')}
          />
        ) : (
          <NotAllowed />
        )
      case 'invoices':
        return can('facturar') ? (
          <InvoiceList
            invoices={invoices}
            onSelect={selectInvoice}
            onNew={() => setView('create')}
          />
        ) : (
          <NotAllowed />
        )
      case 'detail':
        return can('facturar') && selected ? (
          <Invoice invoice={selected} onBack={() => setView('invoices')} />
        ) : (
          <NotAllowed />
        )
      case 'payments':
        return can('cobrar') ? (
          <Payments invoices={invoices} onPayInvoice={markPaid} />
        ) : (
          <NotAllowed />
        )
      case 'reservations':
        return can('reservas') ? (
          <Reservations
            businessName={businessName || business.name}
            businessTypeName={business.name}
            reservations={reservations}
            onAdd={saveReservation}
            onRemove={removeReservation}
            onGoCalendar={() => setView('calendar')}
          />
        ) : (
          <NotAllowed />
        )
      case 'calendar':
        return can('reservas') ? (
          <CalendarView reservations={reservations} onRemove={removeReservation} />
        ) : (
          <NotAllowed />
        )
      case 'inventory':
        return can('inventario') ? (
          <Inventory
            businessName={businessName || business.name}
            businessId={business.id}
            catalog={catalog}
            onSaveCatalog={saveCatalog}
            canEdit={isAdmin}
          />
        ) : (
          <NotAllowed />
        )
      case 'panel':
        return can('panel') ? (
          <AdminDashboard
            invoices={invoices}
            onViewInvoice={selectInvoice}
            onLoadTestData={loadTestDataset}
          />
        ) : (
          <NotAllowed />
        )
      case 'usuarios':
        return isAdmin ? (
          <UsersManager users={users} saveUsers={saveUsers} currentUser={currentUser} />
        ) : (
          <NotAllowed />
        )
      case 'about':
        return (
          <AboutScreen
            businessName={businessName || business.name}
            userName={userName}
            currentUser={currentUser}
          />
        )
      case 'help':
        return <HelpScreen />
      default:
        return (
          <div className="home-content">
            <div className="home-card">
              <div className="home-hero-row">
                <div className="home-hero-text">
                  <h2>Buen día, {currentUser.nombre || userName}.</h2>
                  <p className="subtitle">
                    {businessName || business.name} ·{' '}
                    {isAdmin ? 'Perfil de administrador' : 'Perfil de empleado'}
                  </p>
                </div>
                <div className="home-business-badge">
                  <span className="biz-badge-letter" style={{ background: business.color }}>
                    <BusinessMark id={business.id} size={22} color="#fff" />
                  </span>
                  <span>
                    <strong>{business.name}</strong>
                    <small>{business.items.length} productos precargados</small>
                  </span>
                </div>
              </div>
            </div>

            <div className="home-grid">
              {quickActions.map((q) => (
                <button
                  key={q.go}
                  type="button"
                  className="quick-card"
                  onClick={() => setView(q.go)}
                >
                  <span className="quick-icon">
                    <Icon name={q.icon} size={26} />
                  </span>
                  <strong>{q.label}</strong>
                  <span>{q.desc}</span>
                </button>
              ))}
            </div>

            {isAdmin && (
              <div className="test-data-card">
                <h3>Dataset de prueba (reto analítico)</h3>
                <p>
                  Carga las <strong>8 facturas de TechStore S.A.</strong> para validar el panel
                  administrativo: detección de la factura atípica de{' '}
                  <strong>{formatColones(1274000)}</strong> y el conteo de estados (vencidas,
                  pendientes y pagadas).
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

  function NotAllowed() {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Icon name="alert" size={36} />
        </div>
        <h3>Acceso restringido</h3>
        <p>Tu perfil no tiene permisos para esta sección. Contacta al administrador.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo size={40} />
          <div className="sidebar-brand-text">
            <strong>AIDEN&apos;S SYSTEM</strong>
            <span>{businessName || business.name}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <h4 className="sidebar-section-title">MENÚ</h4>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user-chip">
            <span className="user-avatar small">
              {(currentUser.nombre || userName).charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{currentUser.nombre || userName}</strong>
              <span>{isAdmin ? 'Administrador' : 'Empleado'}</span>
            </div>
          </div>
          <button type="button" className="sidebar-logout" onClick={onLogout}>
            <Icon name="logout" size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="topbar-brand">
            <Logo size={30} />
            <span className="topbar-name">Aiden&apos;s System</span>
            <span className="topbar-divider" />
            <span className="topbar-biz">
              {businessName || business.name} · {business.name}
            </span>
          </div>
          <span className="topbar-role">
            {isAdmin ? 'Administrador' : 'Empleado'} · {currentUser.nombre || userName}
          </span>
        </header>

        {renderContent()}
      </main>
    </div>
  )
}

export default Dashboard