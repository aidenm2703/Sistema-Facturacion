const USERS_KEY = 'aiden-users'
const SESSION_KEY = 'aiden-session'
const SETTINGS_KEY = 'aiden-settings'

const clave = (username) => String(username).trim().toLowerCase()

function readIndex() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) {
        const index = {}
        for (const u of data) {
          if (u && u.username) index[clave(u.username)] = u
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(index))
        return index
      }
      if (data && typeof data === 'object') return data
    }
  } catch {
    /* ignore */
  }
  return {}
}

export const usuarioService = {
  obtenerTodos() {
    return Object.values(readIndex())
  },

  obtenerPorId(username) {
    if (!username) return null
    return readIndex()[clave(username)] || null
  },

  guardarTodos(list) {
    const index = {}
    for (const u of Array.isArray(list) ? list : []) {
      if (u && u.username) index[clave(u.username)] = u
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(index))
    return Object.values(index)
  },

  crear(user) {
    const index = readIndex()
    index[clave(user.username)] = user
    localStorage.setItem(USERS_KEY, JSON.stringify(index))
    return user
  },

  actualizar(username, cambios) {
    const index = readIndex()
    const key = clave(username)
    if (index[key]) index[key] = { ...index[key], ...cambios }
    localStorage.setItem(USERS_KEY, JSON.stringify(index))
    return this.obtenerPorId(username)
  },

  actualizarPermiso(username, key) {
    const index = readIndex()
    const k = clave(username)
    if (index[k]) {
      index[k] = { ...index[k], permisos: { ...index[k].permisos, [key]: !index[k].permisos[key] } }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(index))
    return this.obtenerPorId(username)
  },

  eliminar(username) {
    const index = readIndex()
    delete index[clave(username)]
    localStorage.setItem(USERS_KEY, JSON.stringify(index))
  },

  existe(username) {
    if (!username) return false
    return Boolean(readIndex()[clave(username)])
  },

  iniciarSesion(username) {
    try {
      sessionStorage.setItem(SESSION_KEY, username)
    } catch {
      /* ignore */
    }
  },

  cerrarSesion() {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  },

  sesionActiva() {
    try {
      return sessionStorage.getItem(SESSION_KEY) || ''
    } catch {
      return ''
    }
  },

  obtenerSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  },

  guardarSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return settings
  },
}