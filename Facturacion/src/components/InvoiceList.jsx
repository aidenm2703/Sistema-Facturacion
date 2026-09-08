import { derivarEstado } from '../utils/analytics'

const formatMoney = (n) => '$' + Number(n || 0).toFixed(2)

function InvoiceList({ invoices, onSelect, onNew }) {
  if (invoices.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🗒️</div>
        <h3>No hay facturas registradas</h3>
        <p>Crea tu primera factura para que aparezca aquí.</p>
        {onNew && (
          <button type="button" className="btn btn-primary" onClick={onNew}>
            + Nueva factura
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="invoice-list">
      <div className="list-head">
        <h2>Mis facturas</h2>
        {onNew && (
          <button type="button" className="btn btn-primary" onClick={onNew}>
            + Nueva factura
          </button>
        )}
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Vence</th>
            <th>Estado</th>
            <th className="num">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => {
            const estado = derivarEstado(inv)
            const badgeClass =
              estado === 'Pagada'
                ? 'badge-pagada'
                : estado === 'Vencida'
                ? 'badge-vencida'
                : 'badge-pendiente'
            return (
              <tr key={inv.id} className="list-row" onClick={() => onSelect(inv)}>
                <td>{inv.numero}</td>
                <td>{inv.cliente}</td>
                <td>{inv.fecha}</td>
                <td>{inv.fechaVencimiento || '—'}</td>
                <td>
                  <span className={`invoice-status ${badgeClass}`}>{estado}</span>
                </td>
                <td className="num">{formatMoney(inv.total)}</td>
                <td className="row-action">Ver →</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="list-hint">Haz clic en una factura para ver su diseño completo.</p>
    </div>
  )
}

export default InvoiceList
