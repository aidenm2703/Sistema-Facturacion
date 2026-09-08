const STORAGE_KEY = 'aiden-invoices'

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

function normalize(inv) {
  return withDefaultDue(computeTotals(inv))
}

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

function readIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) {
        const index = {}
        for (const inv of data) {
          if (inv && inv.id) index[inv.id] = normalize(inv)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(index))
        return index
      }
      if (data && typeof data === 'object') return data
    }
  } catch {
    /* ignore */
  }
  return {}
}

function writeIndex(index) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(index))
  return index
}

export const facturaService = {
  obtenerIndex() {
    const index = readIndex()
    if (Object.keys(index).length === 0) {
      const inv = normalize({ ...exampleInvoice })
      return { [inv.id]: inv }
    }
    return index
  },

  obtenerTodas() {
    return Object.values(this.obtenerIndex())
  },

  obtenerPorId(id) {
    if (id == null || id === '') return null
    const found = readIndex()[id]
    return found ? normalize(found) : null
  },

  buscar(termino) {
    const q = String(termino == null ? '' : termino).trim()
    if (!q) return null
    const directa = this.obtenerPorId(q)
    if (directa) return directa
    const lower = q.toLowerCase()
    return (
      this.obtenerTodas().find(
        (inv) =>
          String(inv.numero || '').toLowerCase() === lower ||
          String(inv.numero || '').toLowerCase().includes(lower) ||
          String(inv.cliente || '').toLowerCase() === lower ||
          String(inv.cliente || '').toLowerCase().includes(lower),
      ) || null
    )
  },

  crear(data) {
    const inv = normalize({ id: 'inv-' + Date.now(), ...data })
    writeIndex({ [inv.id]: inv, ...this.obtenerIndex() })
    return inv
  },

  actualizar(id, cambios) {
    const index = this.obtenerIndex()
    if (index[id]) index[id] = normalize({ ...index[id], ...cambios })
    writeIndex(index)
    return this.obtenerPorId(id)
  },

  marcarPagada(id) {
    const index = this.obtenerIndex()
    if (index[id]) index[id] = { ...index[id], pagada: true }
    writeIndex(index)
    return this.obtenerPorId(id)
  },

  eliminar(id) {
    const index = this.obtenerIndex()
    delete index[id]
    writeIndex(index)
  },

  guardarTodas(list) {
    const index = {}
    for (const inv of Array.isArray(list) ? list : []) {
      if (inv && inv.id) index[inv.id] = normalize(inv)
    }
    writeIndex(index)
    return Object.values(index)
  },

  siguienteNumero() {
    return this.obtenerTodas().length + 1
  },

  seed(list) {
    const index = {}
    for (const inv of Array.isArray(list) ? list : []) {
      if (inv && inv.id) index[inv.id] = normalize(inv)
    }
    writeIndex(index)
  },
}