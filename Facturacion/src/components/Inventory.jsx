import { useRef, useState } from 'react'
import { formatColones } from '../utils/currency'
import { toast } from '../utils/toast'
import { compressImage } from '../utils/storage'
import Icon from './Icon'
import BusinessMark from './BusinessMark'

function Inventory({ businessName, businessId, catalog, onSaveCatalog, canEdit }) {
  const [items, setItems] = useState(() => catalog.map((it) => ({ ...it })))
  const [saved, setSaved] = useState(false)
  const [newItem, setNewItem] = useState({ descripcion: '', precio: '', stock: '' })
  const [newError, setNewError] = useState('')
  const [confirming, setConfirming] = useState(null)
  const confirmTimer = useRef(null)
  const fileInputs = useRef({})

  const setItem = (id, key, value) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)))

  const addItem = () => {
    const desc = newItem.descripcion.trim()
    const precio = Number(newItem.precio)
    const stock = Number(newItem.stock)
    if (!desc) {
      setNewError('Escribe la descripción del producto.')
      return
    }
    if (!Number.isFinite(precio) || precio < 0) {
      setNewError('Indica un precio válido en colones.')
      return
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setNewError('Indica una cantidad de stock válida.')
      return
    }
    setNewError('')
    setItems((prev) => [
      ...prev,
      { id: 'it-' + Date.now(), descripcion: desc, precio, stock, imagen: null },
    ])
    setNewItem({ descripcion: '', precio: '', stock: '' })
  }

  const readImage = async (file, id) => {
    if (!file) return
    try {
      const dataUrl = await compressImage(file)
      setItem(id, 'imagen', dataUrl)
      toast.success(
        'Imagen cargada',
        'La imagen se redimensionó para ocupar poco espacio y se guardó correctamente.',
      )
    } catch {
      toast.danger('Error', 'No se pudo procesar esa imagen. Prueba con otra.')
    }
  }

  const askRemove = (id) => {
    if (confirming === id) {
      setConfirming(null)
      clearTimeout(confirmTimer.current)
      setItems((prev) => prev.filter((it) => it.id !== id))
      return
    }
    setConfirming(id)
    toast.warning('Eliminar producto', 'Pulsa de nuevo para confirmar la eliminación.')
    confirmTimer.current = setTimeout(() => setConfirming(null), 3500)
  }

  const save = () => {
    onSaveCatalog(items)
    setSaved(true)
    toast.success('Inventario guardado', 'Los cambios se guardaron correctamente.')
    setTimeout(() => setSaved(false), 2200)
  }

  const totalValue = items.reduce((acc, it) => acc + Number(it.precio) * Number(it.stock), 0)

  return (
    <div className="inventory">
      <div className="section-head">
        <div>
          <h2>Inventario</h2>
          <p className="subtitle">
            {businessName} · {items.length} productos registrados
          </p>
        </div>
        {canEdit && (
          <button type="button" className="btn btn-primary" onClick={save} disabled={saved}>
            <Icon name="check" size={15} />
            {saved ? 'Guardado' : 'Guardar cambios'}
          </button>
        )}
      </div>

      {!canEdit && (
        <p className="perm-note">Tienes acceso de solo lectura al inventario.</p>
      )}

      <div className="inv-summary">
        <span>Valor total del inventario</span>
        <strong>{formatColones(totalValue)}</strong>
      </div>

      <div className="inv-table-wrap">
        <table className="list-table">
          <thead>
            <tr>
              <th></th>
              <th>#</th>
              <th>Descripción</th>
              <th className="num">Precio unitario</th>
              <th className="num">Stock</th>
              <th className="num">Valor en stock</th>
              {canEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.id}>
                <td className="product-thumb-cell">
                  <span className="product-thumb">
                    {it.imagen ? (
                      <img src={it.imagen} alt={it.descripcion} />
                    ) : (
                      <BusinessMark id={businessId} size={20} color="#9fb2c9" />
                    )}
                  </span>
                </td>
                <td>{idx + 1}</td>
                <td>
                  {canEdit ? (
                    <input
                      type="text"
                      value={it.descripcion}
                      onChange={(e) => setItem(it.id, 'descripcion', e.target.value)}
                      className="inv-input inv-desc"
                    />
                  ) : (
                    it.descripcion
                  )}
                  {canEdit && (
                    <span className="product-img-actions">
                      <input
                        ref={(el) => {
                          fileInputs.current[it.id] = el
                        }}
                        type="file"
                        accept="image/*"
                        className="product-file"
                        onChange={(e) => readImage(e.target.files[0], it.id)}
                      />
                      <button
                        type="button"
                        className="link-btn product-img-btn"
                        onClick={() => fileInputs.current[it.id]?.click()}
                      >
                        <Icon name="settings" size={12} />
                        {it.imagen ? 'Cambiar foto' : 'Cargar / tomar foto'}
                      </button>
                      {it.imagen && (
                        <button
                          type="button"
                          className="link-btn link-btn-danger product-img-btn"
                          onClick={() => setItem(it.id, 'imagen', null)}
                        >
                          Quitar foto
                        </button>
                      )}
                    </span>
                  )}
                </td>
                <td className="num">
                  {canEdit ? (
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={it.precio}
                      onChange={(e) => setItem(it.id, 'precio', Number(e.target.value))}
                      className="inv-input"
                    />
                  ) : (
                    formatColones(it.precio)
                  )}
                </td>
                <td className="num">
                  {canEdit ? (
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={it.stock}
                      onChange={(e) => setItem(it.id, 'stock', Number(e.target.value))}
                      className="inv-input inv-stock"
                    />
                  ) : (
                    it.stock
                  )}
                </td>
                <td className="num">{formatColones(it.precio * it.stock)}</td>
                {canEdit && (
                  <td className="num">
                    <button
                      type="button"
                      className="btn btn-danger btn-square inv-remove"
                      onClick={() => askRemove(it.id)}
                      title="Eliminar producto"
                    >
                      {confirming === it.id ? <Icon name="alert" size={14} /> : '✕'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <div className="inv-add-row">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newItem.descripcion}
            onChange={(e) => setNewItem((n) => ({ ...n, descripcion: e.target.value }))}
          />
          <input
            type="number"
            min="0"
            step="50"
            placeholder="Precio (₡)"
            value={newItem.precio}
            onChange={(e) => setNewItem((n) => ({ ...n, precio: e.target.value }))}
          />
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={newItem.stock}
            onChange={(e) => setNewItem((n) => ({ ...n, stock: e.target.value }))}
          />
          <button type="button" className="btn btn-primary" onClick={addItem}>
            <Icon name="plus" size={15} /> Agregar producto
          </button>
          {newError && <span className="error inv-new-error">{newError}</span>}
        </div>
      )}

      {canEdit && (
        <p className="list-hint">
          Pulsa «Cargar / tomar foto» para agregar una imagen a cada producto. Las
          imágenes se guardan pequeñas y optimizadas para cargarse en cualquier
          computadora. Los productos precargados usan un ícono según el tipo de negocio.
        </p>
      )}
      <p className="list-hint">
        Los precios de aquí se usan al facturar: al cargar un producto se toma su precio
        actual del inventario y se descuenta el stock vendido.
      </p>
    </div>
  )
}

export default Inventory