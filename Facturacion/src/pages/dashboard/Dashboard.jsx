import { useState } from 'react'
import { Logo, Icon } from '../../components'
import { sidebarSections, isSectionAllowed, renderPage } from '../../routes'
import NotAllowed from './NotAllowed'
import { formatColones } from '../../utils'
import { toast } from '../../utils'
import { guardarLocalJson } from '../../utils'

const STORAGE_KEY = 'aiden-invoices'
const RESERVATIONS_KEY = 'aiden-reservations'
const INVENTORY_KEY = 'aiden-inventario'

const exampleInvoice = {
  id: 'inv-1001',
  emisor: 'TechStore S.A.',
  RUC: '3-101-555000',
  direccionEmpresa: 'Galería Central, San José',
  correoEmpresa: 'ventas@techstore.com',
  cliente: 'Juan Pérez',
  direccionCliente: 'Barrio Escalante, San José',
  correoCliente: 'juan.perez@gmail.com',
  numero: 'FACT-001',
  fecha: new Date().toISOString().slice(0, 10),
  impuesto: 13,
  items: [
    { descripcion: 'Teclado mecánico', cantidad: 2, precio: 18000 },
    { descripcion: 'Monitor 24 pulgadas', cantidad: 1, precio: 95000 },
    { descripcion: 'Mouse inalámbrico', cantidad: 3, precio: 12000 },
  ],
}

function computeTotals(inv) {
  const subtotal = (inv.items || []).reduce(
    (acc, it) => acc + Number(it.cantidad) * Number(it.precio),
    0,
  )
  const impTotal = subtotal * ((Number(inv.impuesto) || 0) / 100)
  return { ...inv, subtotal, impTotal, total: Math.round((subtotal + impTotal) * 100) / 100 }
}

function withDefaultDue(inv) {
  if (inv.fechaVencimiento) return inv
  const d = new Date(inv.fecha)
  d.setDate(d.getDate() + 30)
  return { ...inv, fechaVencimiento: d.toISOString().slice(0, 10) }
}

function newInvoiceId() {
  return 'inv-' + Date.now()
}

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
    return withDefaultDue(
      computeTotals({
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
      }),
    )
  })
}

function loadInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length > 0)
        return list.map((i) => withDefaultDue(computeTotals(i)))
    }
  } catch {
    /* ignore */
  }
  return [withDefaultDue(computeTotals({ ...exampleInvoice }))]
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
  const [invoices, setInvoices] = useState(loadInvoices)
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [reservations, setReservations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [inventory, setInventory] = useState(() => {
    try {
      const raw = localStorage.getItem(INVENTORY_KEY)
      if (raw) {
        const map = JSON.parse(raw)
        if (map && map[business.id]) return map
      }
    } catch {
      /* ignore */
    }
    return {
      [business.id]: business.items.map((it, idx) => ({
        id: 'it-' + business.id + '-' + idx,
        descripcion: it.descripcion,
        precio: it.precio,
        stock: 100,
      })),
    }
  })

  const isAdmin = currentUser.role === 'admin'
  const perm = isAdmin
    ? { facturar: true, cobrar: true, inventario: true, reservas: true, panel: true }
    : currentUser.permisos || {}
  const can = (k) => perm[k] === true

  const catalog = inventory[business.id] || business.items
  const nextNumber = invoices.length + 1

  const persistInvoices = (next) => {
    setInvoices(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const consumeStock = (itemRows) => {
    const next = { ...inventory }
    const arr = (next[business.id] || []).map((x) => ({ ...x }))
    itemRows.forEach((r) => {
      const idx = arr.findIndex(
        (p) => p.descripcion.trim().toLowerCase() === r.descripcion.trim().toLowerCase(),
      )
      if (idx >= 0) {
        arr[idx].stock = Math.max(0, Number(arr[idx].stock) - Number(r.cantidad))
      }
    })
    next[business.id] = arr
    setInventory(next)
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(next))
  }

  const saveInvoice = (data) => {
    const inv = withDefaultDue(computeTotals({ id: newInvoiceId(), ...data }))
    const next = [inv, ...invoices]
    persistInvoices(next)
    consumeStock(data.items)
    setSelected(inv)
    setView('detail')
    toast.success('Factura guardada', `Se guardó la factura ${inv.numero}.`)
  }

  const markPaid = (id) => {
    persistInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, pagada: true } : inv)))
    toast.success('Pago registrado', 'La factura quedó marcada como pagada.')
  }

  const selectInvoice = (inv) => {
    setSelected(inv)
    setView('detail')
  }

  const saveReservation = (res) => {
    const next = [res, ...reservations]
    setReservations(next)
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(next))
    toast.success('Reserva registrada', res.cliente
      ? `Reserva a nombre de ${res.cliente}.`
      : 'La reserva se guardó correctamente.')
  }
  const updateReservations = (res) => {
    setReservations(res)
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(res))
  }
  const removeReservation = (id) => updateReservations(reservations.filter((r) => r.id !== id))

  const saveCatalog = (items) => {
    const next = { ...inventory, [business.id]: items }
    if (!guardarLocalJson(INVENTORY_KEY, next)) {
      toast.danger(
        'Espacio lleno',
        'No se pudieron guardar los cambios. Exporta un respaldo o reduce el tamaño de las fotos.',
      )
      return
    }
    setInventory(next)
  }

  const loadTestDataset = () => {
    persistInvoices(buildTestDataset())
    setView('panel')
    toast.info(
      'Datos de prueba cargados',
      'Se cargaron las 8 facturas de TechStore S.A. para validar el panel administrativo.',
    )
  }

  const navItems = sidebarSections
    .filter((s) => s.inSidebar !== false && isSectionAllowed(s, { isAdmin, can }))
    .map((s) => ({ id: s.id, label: s.label, icon: s.icon }))

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

  const ctx = {
    go: setView,
    business,
    businessName: businessName || business.name,
    catalog,
    nextNumber,
    invoices,
    selected,
    saveInvoice,
    markPaid,
    selectInvoice,
    reservations,
    saveReservation,
    removeReservation,
    saveCatalog,
    loadTestDataset,
    users,
    saveUsers,
    currentUser,
    userName,
    isAdmin,
    quickActions,
    formatColones,
  }

  const renderContent = () => {
    const section = sidebarSections.find((s) => s.id === view)
    if (!isSectionAllowed(section, { isAdmin, can })) return <NotAllowed />
    return renderPage(view, ctx)
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