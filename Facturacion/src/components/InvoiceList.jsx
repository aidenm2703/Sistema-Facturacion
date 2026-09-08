import { useState } from 'react'
import { derivarEstado } from '../utils/analytics'
import { formatColones } from '../utils/currency'
import { facturaService } from '../services/facturaService'
import Icon from './Icon'

function InvoiceList({ invoices, onSelect, onNew }) {
  const [buscarId, setBuscarId] = useState('')
  const [noEncontrada, setNoEncontrada] = useState(false)

  const buscarFactura = (e) => {
    e.preventDefault()
    const termino = buscarId.trim()
    if (!termino) return
    const encontrada = facturaService.buscar(termino)
    if (encontrada) {
      setNoEncontrada(false)
      onSelect(encontrada)
    } else {
      setNoEncontrada(true)
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Icon name="invoices" size={40} />
        </div>
        <h3>No hay facturas registradas</h3>
        <p>Crea tu primera factura para que aparezca aquí.</p>
        {onNew && (
          <button type="button" className="btn btn-primary" onClick={onNew}>
            <Icon name="plus" size={16} /> Nueva factura
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
            <Icon name="plus" size={16} /> Nueva factura
          </button>
        )}
      </div>

      <form className="inv-search" onSubmit={buscarFactura}>
        <input
          type="text"
          value={buscarId}
          onChange={(e) => {
            setBuscarId(e.target.value)
            setNoEncontrada(false)
          }}
          placeholder="Buscar por ID, número o cliente (ej.: inv-1001, FACT-001, Juan)"
        />
        <button type="submit" className="btn btn-ghost">
          <Icon name="invoices" size={14} /> Buscar
        </button>
        {noEncontrada && (
          <span className="error inv-search-error">No se encontró una factura con ese dato.</span>
        )}
      </form>

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
                <td className="num">{formatColones(inv.total)}</td>
                <td className="row-action">Ver →</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="list-hint">
        Haz clic en una factura para ver su diseño completo. El buscador usa un índice por ID
        (lookup directo, sin recorrer toda la lista) y también encuentra por número de factura o
        nombre del cliente.
      </p>
    </div>
  )
}

export default InvoiceList