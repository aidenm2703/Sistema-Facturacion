import { useState } from 'react'

function Reservations({ businessName, reservations, onAdd, onRemove, onGoCalendar }) {
  const [form, setForm] = useState({
    cliente: '',
    contacto: '',
    fecha: new Date().toISOString().slice(0, 10),
    hora: '20:00',
    personas: 2,
    notas: '',
  })
  const [reserveErrors, setReserveErrors] = useState({})
  const [callingId, setCallingId] = useState(null)
  const [lastCall, setLastCall] = useState(null)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const pagoPorPersona = businessName === 'Restaurante' ? 80 : 50
  const anticipo = form.personas * pagoPorPersona

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
          <h2>📅 Sistema de reservas</h2>
          <p className="subtitle">
            Reserva una mesa o cita para varias personas y simula llamar al cliente.
          </p>
        </div>
        {onGoCalendar && (
          <button type="button" className="btn btn-ghost" onClick={onGoCalendar}>
            Ver calendario 🗓️
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
              placeholder="+51 955 123 456"
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
          <label>
            Notas
            <textarea
              value={form.notas}
              onChange={(e) => setField('notas', e.target.value)}
              placeholder="Ocasión especial, preferencias..."
              rows="2"
            />
          </label>

          <div className="anticipo-box">
            <span>
              Anticipo estimado ({form.personas} × ${pagoPorPersona})
            </span>
            <strong>{formatMoney(anticipo)}</strong>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            📅 Agregar reserva
          </button>
        </form>

        <div className="reserve-list">
          <h3>Reservas activas ({reservations.length})</h3>
          {reservations.length === 0 ? (
            <div className="empty-state small">
              <div className="empty-icon">📅</div>
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
                  <span>📅 {r.fecha} · ⏰ {r.hora}</span>
                  <span>👤 {r.personas} pers.</span>
                </div>
                {r.contactoTel && <p className="reserve-contact">📞 {r.contactoTel}</p>}
                {r.notas && <p className="reserve-notes">{r.notas}</p>}
                <div className="reserve-card-foot">
                  <span className="anticipo-text">Anticipo: {formatMoney(r.anticipo)}</span>
                  <div className="reserve-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={() => simulateCall(r)}
                      disabled={!!callingId}
                    >
                      {callingId === r.id ? '📞 Llamando...' : '📞 Llamar'}
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
              <div className="call-popup-ring">📞</div>
              <strong>Llamando a {lastCall.cliente}...</strong>
              <span>{lastCall.contactoTel || 'Sin teléfono'}</span>
            </div>
          )}
          {lastCall && !callingId && (
            <div className="call-popup done">
              <strong>✓ Fin de la llamada con {lastCall.cliente}</strong>
              <span>El cliente fue notificado de su reserva.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const formatMoney = (n) => '$' + Number(n || 0).toFixed(2)

export default Reservations
