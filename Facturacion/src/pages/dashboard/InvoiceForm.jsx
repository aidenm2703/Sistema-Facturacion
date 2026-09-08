import { useState } from 'react'
import { formatColones } from '../../utils'
import { BusinessMark } from '../../components'

function InvoiceForm({ business, businessName, nextInvoiceNumber, catalog, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    const hoy = new Date()
    const vencimiento = new Date(hoy)
    vencimiento.setDate(vencimiento.getDate() + 30)
    const iso = (d) => d.toISOString().slice(0, 10)
    return {
      emisor: businessName || business?.name || '',
      RUC: business?.prefilled?.RUC || '',
      direccionEmpresa: business?.prefilled?.direccion || '',
      correoEmpresa: business?.prefilled?.correo || '',
      cliente: '',
      direccionCliente: '',
      correoCliente: '',
      numero: String(nextInvoiceNumber),
      fecha: iso(hoy),
      fechaVencimiento: iso(vencimiento),
      impuesto: business?.prefilled?.impuesto ?? 13,
      items: [{ descripcion: '', cantidad: 1, precio: 0 }],
    }
  })
  const [errors, setErrors] = useState({})
  const [showCatalog, setShowCatalog] = useState(false)

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const setItem = (index, key, value) => {
    const items = [...form.items]
    items[index][key] = key === 'cantidad' || key === 'precio' ? Number(value) : value
    setForm((f) => ({ ...f, items }))
  }

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { descripcion: '', cantidad: 1, precio: 0 }],
    }))

  const removeItem = (index) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }))

  const loadCatalogItem = (item) => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { descripcion: item.descripcion, cantidad: 1, precio: item.precio }],
    }))
  }

  const subtotal = form.items.reduce((acc, it) => acc + (it.cantidad || 0) * (it.precio || 0), 0)
  const impTotal = subtotal * ((form.impuesto || 0) / 100)
  const total = subtotal + impTotal

  const validate = () => {
    const errs = {}
    if (!form.emisor.trim()) errs.emisor = 'El nombre de la empresa es obligatorio'
    if (!form.RUC.trim()) errs.RUC = 'El RUC/NIT/ID fiscal es obligatorio'
    if (!form.cliente.trim()) errs.cliente = 'El cliente es obligatorio'
    if (!form.direccionCliente.trim()) errs.direccionCliente = 'La dirección es obligatoria'
    if (form.items.length === 0) errs.items = 'Agrega al menos un ítem'
    form.items.forEach((it, i) => {
      if (!it.descripcion.trim()) errs[`item-${i}`] = 'Descripción requerida'
      if (!Number.isFinite(it.cantidad) || it.cantidad <= 0)
        errs[`item-${i}`] = 'Cantidad numérica mayor a 0'
      if (!Number.isFinite(it.precio) || it.precio < 0)
        errs[`item-${i}`] = 'Precio numérico válido'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      items: form.items.map((it) => ({
        descripcion: it.descripcion.trim(),
        cantidad: it.cantidad,
        precio: it.precio,
      })),
      subtotal,
      impTotal,
      total,
      impuesto: form.impuesto,
    })
  }

  const productCatalog = catalog && catalog.length > 0 ? catalog : business?.items || []

  return (
    <form className="invoice-form" onSubmit={handleSave} noValidate>
      <div className="form-header">
        <h2>Crear nueva factura</h2>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>

      <section className="form-section">
        <h3>Datos del emisor</h3>
        <div className="form-grid">
          <label>
            Nombre de la empresa
            <input
              type="text"
              value={form.emisor}
              onChange={(e) => setField('emisor', e.target.value)}
              placeholder="Nombre de tu negocio"
            />
            {errors.emisor && <span className="error">{errors.emisor}</span>}
          </label>
          <label>
            RUC / NIT / ID fiscal
            <input
              type="text"
              value={form.RUC}
              onChange={(e) => setField('RUC', e.target.value)}
              placeholder="3-101-123456"
            />
            {errors.RUC && <span className="error">{errors.RUC}</span>}
          </label>
          <label>
            Dirección de la empresa
            <input
              type="text"
              value={form.direccionEmpresa}
              onChange={(e) => setField('direccionEmpresa', e.target.value)}
              placeholder="Dirección"
            />
          </label>
          <label>
            Correo de la empresa
            <input
              type="text"
              value={form.correoEmpresa}
              onChange={(e) => setField('correoEmpresa', e.target.value)}
              placeholder="correo@empresa.com"
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <h3>Datos del cliente</h3>
        <div className="form-grid">
          <label>
            Nombre del cliente
            <input
              type="text"
              value={form.cliente}
              onChange={(e) => setField('cliente', e.target.value)}
              placeholder="Juan Pérez"
            />
            {errors.cliente && <span className="error">{errors.cliente}</span>}
          </label>
          <label>
            Dirección del cliente
            <input
              type="text"
              value={form.direccionCliente}
              onChange={(e) => setField('direccionCliente', e.target.value)}
              placeholder="Dirección del cliente"
            />
            {errors.direccionCliente && (
              <span className="error">{errors.direccionCliente}</span>
            )}
          </label>
          <label>
            Correo del cliente
            <input
              type="text"
              value={form.correoCliente}
              onChange={(e) => setField('correoCliente', e.target.value)}
              placeholder="cliente@correo.com"
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <h3>Información de la factura</h3>
        <div className="form-grid">
          <label>
            Número de factura
            <input
              type="text"
              value={form.numero}
              onChange={(e) => setField('numero', e.target.value)}
            />
          </label>
          <label>
            Fecha de emisión
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setField('fecha', e.target.value)}
            />
          </label>
          <label>
            Fecha de vencimiento
            <input
              type="date"
              value={form.fechaVencimiento}
              onChange={(e) => setField('fechaVencimiento', e.target.value)}
            />
          </label>
          <label>
            Impuesto (%)
            <input
              type="number"
              min="0"
              max="100"
              value={form.impuesto}
              onChange={(e) => setField('impuesto', Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <h3>Ítems (productos / servicios)</h3>

        {productCatalog.length > 0 && (
          <div className="catalog">
            <button
              type="button"
              className="btn btn-ghost-small"
              onClick={() => setShowCatalog((s) => !s)}
            >
              {showCatalog ? 'Ocultar productos' : 'Cargar producto del inventario'}
            </button>
            {showCatalog && (
              <div className="catalog-list">
                {productCatalog.map((it) => (
                  <button
                    type="button"
                    key={it.id || it.descripcion}
                    className="catalog-item"
                    onClick={() => loadCatalogItem(it)}
                  >
                    <span className="catalog-thumb">
                      {it.imagen ? (
                        <img src={it.imagen} alt="" />
                      ) : (
                        <BusinessMark id={business?.id} size={18} color="#9fb2c9" />
                      )}
                    </span>
                    <span>
                      {it.descripcion}
                      <small className={Number(it.stock) <= 5 ? 'low-stock' : ''}>
                        {Number(it.stock) <= 5 && Number(it.stock) > 0
                          ? ` · Quedan ${it.stock}`
                          : ''}
                        {Number(it.stock) === 0 ? ' · Sin existencias' : ''}
                      </small>
                    </span>
                    <span className="catalog-price">{formatColones(it.precio)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {form.items.map((item, index) => (
          <div className="item-row" key={index}>
            <label className="item-desc">
              Descripción
              <input
                type="text"
                value={item.descripcion}
                onChange={(e) => setItem(index, 'descripcion', e.target.value)}
                placeholder="Descripción del producto/servicio"
              />
            </label>
            <label>
              Cant.
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => setItem(index, 'cantidad', e.target.value)}
              />
            </label>
            <label>
              Precio unitario (₡)
              <input
                type="number"
                min="0"
                step="50"
                value={item.precio}
                onChange={(e) => setItem(index, 'precio', e.target.value)}
              />
            </label>
            <div className="item-sub">
              <span>Subtotal</span>
              <strong>{formatColones((item.cantidad || 0) * (item.precio || 0))}</strong>
            </div>
            <button
              type="button"
              className="btn btn-danger btn-square"
              onClick={() => removeItem(index)}
              disabled={form.items.length === 1}
              title="Eliminar ítem"
            >
              ✕
            </button>
            {errors[`item-${index}`] && (
              <span className="error item-error">{errors[`item-${index}`]}</span>
            )}
          </div>
        ))}
        {errors.items && <div className="error">{errors.items}</div>}

        <button type="button" className="btn btn-ghost" onClick={addItem}>
          + Agregar ítem
        </button>
      </section>

      <section className="form-summary">
        <div className="summary-line">
          <span>Subtotal</span>
          <span>{formatColones(subtotal)}</span>
        </div>
        <div className="summary-line">
          <span>Impuesto ({form.impuesto || 0}%)</span>
          <span>{formatColones(impTotal)}</span>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <span>{formatColones(total)}</span>
        </div>
      </section>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Guardar factura
        </button>
      </div>
    </form>
  )
}

export default InvoiceForm