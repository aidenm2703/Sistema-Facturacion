import {
  InvoiceForm,
  InvoiceList,
  Invoice,
  Payments,
  Reservations,
  CalendarView,
  Inventory,
  UsersManager,
  AdminDashboard,
  AboutScreen,
  HelpScreen,
  HomePage,
} from '../pages'

export const sidebarSections = [
  { id: 'home', label: 'Inicio', icon: 'home', permiso: null, inSidebar: true },
  { id: 'create', label: 'Crear factura', icon: 'create', permiso: 'facturar', inSidebar: true },
  { id: 'invoices', label: 'Mis facturas', icon: 'invoices', permiso: 'facturar', inSidebar: true },
  { id: 'payments', label: 'Pagos', icon: 'payments', permiso: 'cobrar', inSidebar: true },
  { id: 'reservations', label: 'Reservas', icon: 'reservas', permiso: 'reservas', inSidebar: true },
  { id: 'calendar', label: 'Calendario', icon: 'calendario', permiso: 'reservas', inSidebar: true },
  { id: 'inventory', label: 'Inventario', icon: 'inventario', permiso: 'inventario', inSidebar: true },
  { id: 'panel', label: 'Panel Admin', icon: 'panel', permiso: 'panel', inSidebar: true },
  { id: 'usuarios', label: 'Usuarios', icon: 'usuarios', permiso: 'admin', inSidebar: true },
  { id: 'about', label: '¿Quiénes somos?', icon: 'info', permiso: null, inSidebar: true },
  { id: 'help', label: 'Ayuda', icon: 'help', permiso: null, inSidebar: true },
  { id: 'detail', label: 'Detalle de factura', icon: 'invoices', permiso: 'facturar', inSidebar: false },
]

export function isSectionAllowed(section, { isAdmin, can }) {
  if (!section || !section.permiso) return true
  if (section.permiso === 'admin') return isAdmin
  return can(section.permiso)
}

export function renderPage(id, ctx) {
  switch (id) {
    case 'home':
      return (
        <HomePage
          userName={ctx.userName}
          businessName={ctx.businessName}
          business={ctx.business}
          currentUser={ctx.currentUser}
          isAdmin={ctx.isAdmin}
          quickActions={ctx.quickActions}
          onGo={ctx.go}
          onLoadTestData={ctx.loadTestDataset}
          formatColones={ctx.formatColones}
        />
      )
    case 'create':
      return (
        <InvoiceForm
          business={ctx.business}
          businessName={ctx.businessName}
          nextInvoiceNumber={ctx.nextNumber}
          catalog={ctx.catalog}
          onSave={ctx.saveInvoice}
          onCancel={() => ctx.go('invoices')}
        />
      )
    case 'invoices':
      return (
        <InvoiceList
          invoices={ctx.invoices}
          onSelect={ctx.selectInvoice}
          onNew={() => ctx.go('create')}
        />
      )
    case 'detail':
      return ctx.selected ? (
        <Invoice invoice={ctx.selected} onBack={() => ctx.go('invoices')} />
      ) : null
    case 'payments':
      return <Payments invoices={ctx.invoices} onPayInvoice={ctx.markPaid} />
    case 'reservations':
      return (
        <Reservations
          businessName={ctx.businessName}
          businessTypeName={ctx.business.name}
          reservations={ctx.reservations}
          onAdd={ctx.saveReservation}
          onRemove={ctx.removeReservation}
          onGoCalendar={() => ctx.go('calendar')}
        />
      )
    case 'calendar':
      return <CalendarView reservations={ctx.reservations} onRemove={ctx.removeReservation} />
    case 'inventory':
      return (
        <Inventory
          businessName={ctx.businessName}
          businessId={ctx.business.id}
          catalog={ctx.catalog}
          onSaveCatalog={ctx.saveCatalog}
          canEdit={ctx.isAdmin}
        />
      )
    case 'panel':
      return (
        <AdminDashboard
          invoices={ctx.invoices}
          onViewInvoice={ctx.selectInvoice}
          onLoadTestData={ctx.loadTestDataset}
        />
      )
    case 'usuarios':
      return (
        <UsersManager
          users={ctx.users}
          saveUsers={ctx.saveUsers}
          currentUser={ctx.currentUser}
        />
      )
    case 'about':
      return (
        <AboutScreen
          businessName={ctx.businessName}
          userName={ctx.userName}
          currentUser={ctx.currentUser}
        />
      )
    case 'help':
      return <HelpScreen />
    default:
      return null
  }
}