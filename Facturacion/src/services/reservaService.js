const RESERVATIONS_KEY = 'aiden-reservations'

function readIndex() {
  try {
    const raw = localStorage.getItem(RESERVATIONS_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) {
        const index = {}
        for (const r of data) {
          if (r && r.id) index[r.id] = r
        }
        localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(index))
        return index
      }
      if (data && typeof data === 'object') return data
    }
  } catch {
    /* ignore */
  }
  return {}
}

export const reservaService = {
  obtenerTodas() {
    return Object.values(readIndex())
  },

  obtenerPorId(id) {
    if (id == null || id === '') return null
    return readIndex()[id] || null
  },

  crear(data) {
    const res = { id: 'res-' + Date.now(), ...data }
    this.guardarIndex({ [res.id]: res, ...readIndex() })
    return res
  },

  actualizar(id, cambios) {
    const index = readIndex()
    if (index[id]) index[id] = { ...index[id], ...cambios }
    this.guardarIndex(index)
    return this.obtenerPorId(id)
  },

  eliminar(id) {
    const index = readIndex()
    delete index[id]
    this.guardarIndex(index)
  },

  guardarTodas(list) {
    const index = {}
    for (const r of Array.isArray(list) ? list : []) {
      if (r && r.id) index[r.id] = r
    }
    this.guardarIndex(index)
    return Object.values(index)
  },

  guardarIndex(index) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(index))
    return index
  },
}