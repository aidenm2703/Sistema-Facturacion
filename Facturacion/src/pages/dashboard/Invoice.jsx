import { derivarEstado } from '../../utils'
import { formatColones } from '../../utils'

function Invoice({ invoice, onBack }) {
  const estado = derivarEstado(invoice)
  const badgeClass =
    estado === 'Pagada' ? 'badge-pagada' : estado === 'Vencida' ? 'badge-vencida' : 'badge-pendiente'

  return (
    <div className="invoice-view-wrapper">
      {onBack && (
        <button type="button" className="btn btn-ghost inline" onClick={onBack}>
          ← Volver al listado
        </button>
      )}

      <div className="invoice-paper">
        <div className="invoice-head">
          <div className="invoice-company">
            <h2>{invoice.emisor}</h2>
            <p>{invoice.direccionEmpresa}</p>
            <p>{invoice.correoEmpresa}</p>
            <p>
              RUC / NIT: <strong>{invoice.RUC}</strong>
            </p>
          </div>
          <div className="invoice-meta">
            <h3>FACTURA</h3>
            <div className="meta-row">
              <span>N°</span>
              <strong>{invoice.numero}</strong>
            </div>
            <div className="meta-row">
              <span>Emisión</span>
              <strong>{invoice.fecha}</strong>
            </div>
            <div className="meta-row">
              <span>Vencimiento</span>
              <strong>{invoice.fechaVencimiento || '—'}</strong>
            </div>
            <span className={`invoice-status ${badgeClass}`}>{estado}</span>
          </div>
        </div>

        <div className="invoice-client">
          <h4>FACTURAR A:</h4>
          <p className="client-name">{invoice.cliente}</p>
          <p>{invoice.direccionCliente}</p>
          <p>{invoice.correoCliente}</p>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th className="num">Cant.</th>
              <th className="num">Precio unit.</th>
              <th className="num">Importe</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it, i) => (
              <tr key={i}>
                <td>{it.descripcion}</td>
                <td className="num">{it.cantidad}</td>
                <td className="num">{formatColones(it.precio)}</td>
                <td className="num">{formatColones(it.cantidad * it.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="totals-line">
            <span>Subtotal</span>
            <span>{formatColones(invoice.subtotal)}</span>
          </div>
          <div className="totals-line">
            <span>Impuesto ({invoice.impuesto || 0}%)</span>
            <span>{formatColones(invoice.impTotal)}</span>
          </div>
          <div className="totals-line grand">
            <span>TOTAL</span>
            <span>{formatColones(invoice.total)}</span>
          </div>
        </div>

        <div className="invoice-foot">
          <p>¡Gracias por su compra!</p>
          <p className="foot-terms">
            Factura generada por Aiden&apos;s System · Estado derivado según fecha de
            vencimiento y pago.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Invoice