import { useRef, useState } from 'react'
import { Icon } from '../../components'
import { toast } from '../../utils'
import { exportarRespaldo, importarRespaldo } from '../../utils'

const PERMS = [
  { key: 'facturar', label: 'Facturar y ver facturas' },
  { key: 'cobrar', label: 'Cobrar (registrar pagos)' },
  { key: 'inventario', label: 'Ver inventario' },
  { key: 'reservas', label: 'Gestionar reservas' },
  { key: 'panel', label: 'Ver panel administrativo' },
]

const emptyPermisos = () => ({
  facturar: true,
  cobrar: false,
  inventario: false,
  reservas: false,
  panel: false,
})

function UsersManager({ users, saveUsers, currentUser }) {
  const [form, setForm] = useState({
    nombre: '',
    username: '',
    password: '',
    permisos: emptyPermisos(),
  })
  const [errors, setErrors] = useState({})
  const [confirming, setConfirming] = useState(null)
  const confirmTimer = useRef(null)
  const importInput = useRef(null)

  const onExport = () => {
    exportarRespaldo()
    toast.success(
      'Respaldo exportado',
      'Se descargó un archivo con todos los datos para abrirlos en otra computadora.',
    )
  }

  const onImportFile = (file) => {
    if (!file) return
    importarRespaldo(file)
      .then((secciones) => {
        toast.success(
          'Respaldo restaurado',
          `Se cargaron ${secciones.length} secciones de datos. El sistema se recargará en unos segundos.`,
        )
        setTimeout(() => location.reload(), 1400)
      })
      .catch(() =>
        toast.danger('Error al restaurar', 'El archivo elegido no es un respaldo válido.'),
      )
  }

  const askConfirm = (username) => {
    if (confirming === username) {
      setConfirming(null)
      clearTimeout(confirmTimer.current)
      saveUsers(users.filter((u) => u.username !== username))
      return
    }
    setConfirming(username)
    confirmTimer.current = setTimeout(() => setConfirming(null), 3500)
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const togglePerm = (key) =>
    setForm((f) => ({ ...f, permisos: { ...f.permisos, [key]: !f.permisos[key] } }))

  const addEmployee = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'Indica el nombre del empleado'
    if (form.username.trim().length < 3) errs.username = 'Usuario de al menos 3 caracteres'
    if (form.password.length < 6) errs.password = 'Contraseña de al menos 6 caracteres'
    if (users.some((u) => u.username.toLowerCase() === form.username.trim().toLowerCase()))
      errs.username = 'Ese usuario ya existe'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const nuevo = {
      nombre: form.nombre.trim(),
      username: form.username.trim(),
      password: form.password,
      role: 'empleado',
      permisos: { ...form.permisos },
    }
    saveUsers([...users, nuevo])
    toast.success('Empleado agregado', `${form.nombre.trim()} ya puede ingresar al sistema.`)
    setForm({ nombre: '', username: '', password: '', permisos: emptyPermisos() })
  }

  const toggleEmployeePerm = (username, key) => {
    saveUsers(
      users.map((u) =>
        u.username === username
          ? { ...u, permisos: { ...u.permisos, [key]: !u.permisos[key] } }
          : u,
      ),
    )
  }

  const removeUser = (username) => {
    const target = users.find((u) => u.username === username)
    if (target.role === 'admin') {
      toast.danger('No es posible', 'No se puede eliminar una cuenta de administrador.')
      return
    }
    askConfirm(username)
  }

  return (
    <div className="users-manager">
      <div className="section-head">
        <div>
          <h2>Usuarios y permisos</h2>
          <p className="subtitle">
            El administrador controla qué puede ver y hacer cada empleado.
          </p>
        </div>
      </div>

      <div className="users-layout">
        <form className="reserve-form user-form" onSubmit={addEmployee} noValidate>
          <h3>Agregar empleado</h3>
          <label>
            Nombre del empleado
            <input
              type="text"
              value={form.nombre}
              placeholder="Ej.: Ana Rojas"
              onChange={(e) => setField('nombre', e.target.value)}
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>}
          </label>
          <label>
            Usuario
            <input
              type="text"
              value={form.username}
              placeholder="Ej.: ana"
              onChange={(e) => setField('username', e.target.value)}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={form.password}
              placeholder="Mínimo 6 caracteres"
              onChange={(e) => setField('password', e.target.value)}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </label>

          <div className="perm-group">
            <span className="perm-label">Permisos del empleado</span>
            {PERMS.map((p) => (
              <label key={p.key} className="perm-check">
                <input
                  type="checkbox"
                  checked={form.permisos[p.key]}
                  onChange={() => togglePerm(p.key)}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Guardar empleado
          </button>
        </form>

        <div className="users-list">
          <h3>Usuarios del sistema ({users.length})</h3>
          {users.map((u) => (
            <div key={u.username} className="user-card">
              <div className="user-card-head">
                <div className="user-avatar">{u.nombre.charAt(0).toUpperCase()}</div>
                <div className="user-id">
                  <strong>{u.nombre}</strong>
                  <span>
                    @{u.username} ·{' '}
                    {u.role === 'admin' ? 'Administrador' : 'Empleado'}
                  </span>
                </div>
                {u.username === currentUser.username && (
                  <span className="badge you">Tú</span>
                )}
              </div>

              {u.role === 'admin' ? (
                <p className="admin-note">Acceso total a todas las secciones.</p>
              ) : (
                <div className="user-perms">
                  {PERMS.map((p) => (
                    <label key={p.key} className={`perm-pill ${u.permisos[p.key] ? 'on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={!!u.permisos[p.key]}
                        onChange={() => toggleEmployeePerm(u.username, p.key)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              )}

              {u.role !== 'admin' && (
                <div className="user-card-foot">
                  <button
                    type="button"
                    className={`btn btn-small ${confirming === u.username ? 'btn-danger confirm-danger' : 'btn-danger'}`}
                    onClick={() => removeUser(u.username)}
                  >
                    {confirming === u.username ? (
                      <>
                        <Icon name="alert" size={13} /> Pulsa para confirmar
                      </>
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="backup-card">
          <div className="backup-head">
            <div>
              <h3>Respaldo de datos</h3>
              <p className="backup-desc">
                Descarga un archivo con facturas, inventario (con imágenes), reservas y
                usuarios. Luego restáuralo en cualquier otra computadora para tener todo
                tu trabajo disponible.
              </p>
            </div>
          </div>
          <div className="backup-actions">
            <button type="button" className="btn btn-primary" onClick={onExport}>
              <Icon name="invoices" size={15} /> Exportar respaldo
            </button>
            <input
              ref={importInput}
              type="file"
              accept="application/json,.json"
              className="product-file"
              onChange={(e) => onImportFile(e.target.files[0])}
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => importInput.current?.click()}
            >
              <Icon name="help" size={15} /> Restaurar respaldo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersManager