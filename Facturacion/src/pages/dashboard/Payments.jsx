import { derivarEstado } from '../../utils'
import { formatColones } from '../../utils'
import { Icon } from '../../components'

function Payments({ invoices, onPayInvoice }) {
  const pagadas = invoices.filter((inv) => derivarEstado(inv) === 'Pagada')
  const pendientesList = invoices.filter((inv) => derivarEstado(inv) !== 'Pagada')
  const vencidas = invoices.filter((inv) => derivarEstado(inv) === 'Vencida')

  const totalPendiente = pendientesList.reduce((acc, inv) => acc + Number(inv.total || 0), 0)
  const totalPagado = pagadas.reduce((acc, inv) => acc + Number(inv.total || 0), 0)

  const markPaid = (invoice) => {
    if (onPayInvoice) onPayInvoice(invoice.id)
  }

  return (
    <div className="payments">
      <h2>Sistema de pagos</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Por cobrar</span>
          <span className="stat-value warn">{formatColones(totalPendiente)}</span>
          <span className="stat-sub">{pendientesList.length} factura(s)</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Cobrado</span>
          <span className="stat-value ok">{formatColones(totalPagado)}</span>
          <span className="stat-sub">{pagadas.length} factura(s)</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Vencidas</span>
          <span className="stat-value danger">{vencidas.length}</span>
          <span className="stat-sub">por cobrar</span>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state small">
          <div className="empty-icon">
            <Icon name="payments" size={40} />
          </div>
          <h3>No hay facturas para cobrar</h3>
          <p>Crea facturas para registrar pagos.</p>
        </div>
      ) : (
        <>
          <h3 className="subtitle">Facturas por cobrar (pendientes y vencidas)</h3>
          {pendientesList.length === 0 ? (
            <div className="empty-state small">
              <Icon name="check" size={22} />
              <h3>Todas las facturas están pagadas</h3>
            </div>
          ) : (
            <div className="pay-list">
              {pendientesList.map((inv) => {
                const estado = derivarEstado(inv)
                const badgeClass =
                  estado === 'Vencida' ? 'badge-vencida' : 'badge-pendiente'
                return (
                  <div key={inv.id} className="pay-row">
                    <div className="pay-info">
                      <strong>Factura N° {inv.numero}</strong>
                      <span>
                        {inv.cliente} · vence {inv.fechaVencimiento || '—'}
                      </span>
                    </div>
                    <div className="pay-amount">{formatColones(inv.total)}</div>
                    <span className={`invoice-status ${badgeClass}`}>{estado}</span>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => markPaid(inv)}
                    >
                      <Icon name="check" size={14} /> Registrar pago
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <h3 className="subtitle">Facturas pagadas</h3>
          <div className="pay-list">
            {pagadas.map((inv) => (
              <div key={inv.id} className="pay-row paid">
                <div className="pay-info">
                  <strong>Factura N° {inv.numero}</strong>
                  <span>{inv.cliente}</span>
                </div>
                <div className="pay-amount">{formatColones(inv.total)}</div>
                <span className="invoice-status badge-pagada">PAGADA</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Payments