import { useState } from 'react'
import { formatColones } from '../../utils'
import { Icon } from '../../components'

function Reservations({ businessName, businessTypeName, reservations, onAdd, onRemove, onGoCalendar }) {
  const [form, setForm] = useState(() => ({
    cliente: '',
    contacto: '',
    fecha: new Date().toISOString().slice(0, 10),
    hora: '20:00',
    personas: 2,
    señal: false,
    notas: '',
  }))
  const [reserveErrors, setReserveErrors] = useState({})
  const [callingId, setCallingId] = useState(null)
  const [lastCall, setLastCall] = useState(null)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const esRestaurante = (businessTypeName || businessName || '').toLowerCase() === 'restaurante'
  const pagoPorPersona = esRestaurante ? 15000 : 10000
  const anticipo = form.señal ? form.personas * pagoPorPersona : 0

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.cliente.trim()) errs.cliente = 'Ingresa el nombre del cliente'
    if (!form.fecha) errs.fecha = 'Elige una fecha'
    if (!form.hora) errs.hora = 'Elige una hora'
    if (!Number.isFinite(form.personas) || form.personas < 1)
      errs.personas = 'Mínimo 1 persona'
    setReserveErrors(errs)
    if (Object.keys(errs).length > 0) return

    onAdd({
      id: 'res-' + Date.now(),
      ...form,
      cliente: form.cliente.trim(),
      contactoTel: form.contacto.trim(),
      personas: Number(form.personas),
      anticipo,
      estado: 'Confirmada',
    })
    setForm({
      cliente: '',
      contacto: '',
      fecha: new Date().toISOString().slice(0, 10),
      hora: '20:00',
      personas: 2,
      señal: false,
      notas: '',
    })
  }

  // Simula llamar a la persona de la reserva
  const simulateCall = (res) => {
    if (callingId) return
    setCallingId(res.id)
    setLastCall(res)
    setTimeout(() => {
      setCallingId(null)
    }, 4000)
  }

  return (
    <div className="reservations">
      <div className="reserve-head">
        <div>
          <h2>Sistema de reservas</h2>
          <p className="subtitle">
            Reserva una mesa o cita para varias personas y simula llamar al cliente.
          </p>
        </div>
        {onGoCalendar && (
          <button type="button" className="btn btn-ghost" onClick={onGoCalendar}>
            <Icon name="calendario" size={16} /> Ver calendario
          </button>
        )}
      </div>

      <div className="reserve-layout">
        <form className="reserve-form" onSubmit={submit} noValidate>
          <h3>Nueva reserva</h3>
          <label>
            Cliente
            <input
              type="text"
              value={form.cliente}
              onChange={(e) => setField('cliente', e.target.value)}
              placeholder="Nombre del cliente"
            />
            {reserveErrors.cliente && <span className="error">{reserveErrors.cliente}</span>}
          </label>
          <label>
            Teléfono / contacto (para llamar)
            <input
              type="text"
              value={form.contacto}
              onChange={(e) => setField('contacto', e.target.value)}
              placeholder="+506 8888 9999"
            />
          </label>
          <div className="form-grid">
            <label>
              Fecha
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setField('fecha', e.target.value)}
              />
              {reserveErrors.fecha && (
                <span className="error">{reserveErrors.fecha}</span>
              )}
            </label>
            <label>
              Hora
              <input
                type="time"
                value={form.hora}
                onChange={(e) => setField('hora', e.target.value)}
              />
              {reserveErrors.hora && <span className="error">{reserveErrors.hora}</span>}
            </label>
          </div>
          <label>
            ¿Para cuántas personas?
            <div className="people-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setField('personas', Math.max(1, form.personas - 1))}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="50"
                value={form.personas}
                onChange={(e) => setField('personas', Number(e.target.value))}
              />
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setField('personas', Math.min(50, form.personas + 1))}
              >
                +
              </button>
            </div>
            {reserveErrors.personas && (
              <span className="error">{reserveErrors.personas}</span>
            )}
          </label>

          <label className="señal-check">
            <input
              type="checkbox"
              checked={form.señal}
              onChange={(e) => setField('señal', e.target.checked)}
            />
            <span>
              Cobrar señal por adelantado
              <small>
                {form.señal
                  ? `${form.personas} × ${formatColones(pagoPorPersona)} = ${formatColones(anticipo)}`
                  : 'No se cobra dinero por adelantado.'}
              </small>
            </span>
          </label>

          <label>
            Notas
            <textarea
              value={form.notas}
              onChange={(e) => setField('notas', e.target.value)}
              placeholder="Ocasión especial, preferencias..."
              rows="2"
            />
          </label>

          <div className={`anticipo-box ${form.señal ? 'with-señal' : 'no-señal'}`}>
            <span>{form.señal ? 'Señal por adelantado' : 'Sin señal (sin cargo)'}</span>
            <strong>{form.señal ? formatColones(anticipo) : '₡0,00'}</strong>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            <Icon name="reservas" size={16} /> Agregar reserva
          </button>
        </form>

        <div className="reserve-list">
          <h3>Reservas activas ({reservations.length})</h3>
          {reservations.length === 0 ? (
            <div className="empty-state small">
              <div className="empty-icon">
                <Icon name="reservas" size={40} />
              </div>
              <h3>Sin reservas</h3>
              <p>Tus reservas aparecerán aquí.</p>
            </div>
          ) : (
            reservations.map((r) => (
              <div key={r.id} className="reserve-card">
                <div className="reserve-card-head">
                  <strong>{r.cliente}</strong>
                  <span className="badge confirmada">{r.estado}</span>
                </div>
                <div className="reserve-card-meta">
                  <span>{r.fecha} · {r.hora}</span>
                  <span>{r.personas} pers.</span>
                </div>
                {r.contactoTel && <p className="reserve-contact">{r.contactoTel}</p>}
                {r.notas && <p className="reserve-notes">{r.notas}</p>}
                <div className="reserve-card-foot">
                  <span className={`anticipo-text ${r.anticipo ? '' : 'no-señal-text'}`}>
                    {r.anticipo ? `Señal: ${formatColones(r.anticipo)}` : 'Sin señal'}
                  </span>
                  <div className="reserve-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={() => simulateCall(r)}
                      disabled={!!callingId}
                    >
                      {callingId === r.id ? (
                        <>
                          <Icon name="clock" size={14} /> Llamando...
                        </>
                      ) : (
                        <>
                          <Icon name="phone" size={14} /> Llamar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => onRemove(r.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {lastCall && callingId && (
            <div className="call-popup">
              <div className="call-phone-icon">
                <Icon name="phone" size={26} />
              </div>
              <strong>Llamando a {lastCall.cliente}...</strong>
              <span>{lastCall.contactoTel || 'Sin teléfono'}</span>
            </div>
          )}
          {lastCall && !callingId && (
            <div className="call-popup done">
              <Icon name="check" size={18} />
              <strong>Fin de la llamada con {lastCall.cliente}</strong>
              <span>El cliente fue notificado de su reserva.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reservations