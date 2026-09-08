import { guardarLocalJson } from '../utils/storage'

const INVENTORY_KEY = 'aiden-inventario'

export const inventarioService = {
  obtenerTodos() {
    try {
      const raw = localStorage.getItem(INVENTORY_KEY)
      if (raw) {
        const map = JSON.parse(raw)
        if (map && typeof map === 'object') return map
      }
    } catch {
      /* ignore */
    }
    return {}
  },

  obtenerCatalogo(businessId) {
    return this.obtenerTodos()[businessId] || []
  },

  obtenerPorId(businessId, id) {
    try {
      const raw = localStorage.getItem(INVENTORY_KEY)
      const map = raw ? JSON.parse(raw) : {}
      const arr = map && map[businessId] ? map[businessId] : []
      return (Array.isArray(arr) && arr.find((it) => it.id === id)) || null
    } catch {
      return null
    }
  },

  inicializar(business) {
    const map = this.obtenerTodos()
    if (map[business.id]) return map
    map[business.id] = business.items.map((it, idx) => ({
      id: 'it-' + business.id + '-' + idx,
      descripcion: it.descripcion,
      precio: it.precio,
      stock: 100,
    }))
    this.guardarTodas(map)
    return map
  },

  crear(businessId, data) {
    const map = this.obtenerTodos()
    const arr = map[businessId] || []
    const item = { id: 'it-' + Date.now(), ...data }
    map[businessId] = [...arr, item]
    this.guardarTodas(map)
    return item
  },

  actualizar(businessId, id, cambios) {
    const map = this.obtenerTodos()
    const arr = map[businessId] || []
    map[businessId] = arr.map((it) => (it.id === id ? { ...it, ...cambios } : it))
    this.guardarTodas(map)
    return this.obtenerPorId(businessId, id)
  },

  eliminar(businessId, id) {
    const map = this.obtenerTodos()
    const arr = map[businessId] || []
    map[businessId] = arr.filter((it) => it.id !== id)
    this.guardarTodas(map)
  },

  guardarCatalogo(businessId, items) {
    const map = this.obtenerTodos()
    map[businessId] = items
    this.guardarTodas(map)
    return map
  },

  descontarStock(businessId, itemRows) {
    const map = this.obtenerTodos()
    const arr = (map[businessId] || []).map((x) => ({ ...x }))
    itemRows.forEach((r) => {
      const idx = arr.findIndex(
        (p) => p.descripcion.trim().toLowerCase() === r.descripcion.trim().toLowerCase(),
      )
      if (idx >= 0) {
        arr[idx].stock = Math.max(0, Number(arr[idx].stock) - Number(r.cantidad))
      }
    })
    map[businessId] = arr
    this.guardarTodas(map)
    return map
  },

  guardarTodas(map) {
    if (!guardarLocalJson(INVENTORY_KEY, map)) return false
    return map
  },
}
