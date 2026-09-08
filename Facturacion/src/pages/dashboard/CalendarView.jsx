import { useState } from 'react'
import { formatColones } from '../../utils'
import { Icon } from '../../components'

function CalendarView({ reservations, onRemove }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [callingId, setCallingId] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthName = firstDay.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  const iso = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const reservationsByDay = (day) => {
    const key = iso(year, month, day)
    return reservations.filter((r) => r.fecha === key)
  }

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1)
    setCurrentDate(d)
    setSelectedDate(null)
  }
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1)
    setCurrentDate(d)
    setSelectedDate(null)
  }

  const todayIso = new Date().toISOString().slice(0, 10)
  const selectedIso = selectedDate
    ? iso(selectedDate.y, selectedDate.m, selectedDate.d)
    : null
  const selectedReservations = selectedDate
    ? reservationsByDay(selectedDate.d)
    : []

  const totalPeople = selectedReservations.reduce((acc, r) => acc + r.personas, 0)

  const simulateCall = (res) => {
    if (callingId) return
    setCallingId(res.id)
    setTimeout(() => setCallingId(null), 4000)
  }

  const cells = []
  for (let i = 0; i < startWeekday; i++) {
    cells.push(<div key={'empty-' + i} className="cal-cell empty" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const res = reservationsByDay(d)
    const key = iso(year, month, d)
    const isToday = key === todayIso
    const isSelected = key === selectedIso
    const hasReservations = res.length > 0
    cells.push(
      <button
        key={key}
        type="button"
        className={`cal-cell day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasReservations ? 'has-res' : ''}`}
        onClick={() => setSelectedDate({ y: year, m: month, d })}
      >
        <span className="day-num">{d}</span>
        {hasReservations && (
          <span className="day-res-count">
            {res.length} reserva{res.length > 1 ? 's' : ''} ·{' '}
            {res.reduce((a, r) => a + r.personas, 0)} pers.
          </span>
        )}
        {!hasReservations && <span className="day-empty">—</span>}
      </button>,
    )
  }

  return (
    <div className="calendar-view">
      <div className="calendar-head">
        <div>
          <h2>Calendario de reservas</h2>
          <p className="subtitle">
            Reservas conectadas al calendario · haz clic en un día para ver los
            detalles.
          </p>
        </div>
        <div className="cal-nav">
          <button type="button" className="btn btn-ghost-small" onClick={prevMonth}>
            ← Anterior
          </button>
          <strong className="cal-month-label">{monthName}</strong>
          <button type="button" className="btn btn-ghost-small" onClick={nextMonth}>
            Siguiente →
          </button>
        </div>
      </div>

      <div className="cal-grid">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
          <div key={d} className="cal-cell weekday">
            {d}
          </div>
        ))}
        {cells}
      </div>

      <div className="cal-details">
        {selectedDate ? (
          <>
            <h3>
              Reservas del {selectedDate.d} de{' '}
              {new Date(selectedDate.y, selectedDate.m).toLocaleDateString('es-ES', {
                month: 'long',
              })}
            </h3>
            {selectedReservations.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">
                  <Icon name="calendario" size={40} />
                </div>
                <h3>No hay reservas este día</h3>
                <p>Agrega una reserva para este día.</p>
              </div>
            ) : (
              <>
                <p className="cal-people-count">
                  Total: {selectedReservations.length} reserva(s) para{' '}
                  <strong>{totalPeople} personas</strong>.
                </p>
                <div className="reserve-list">
                  {selectedReservations.map((r) => (
                    <div key={r.id} className="reserve-card">
                      <div className="reserve-card-head">
                        <strong>{r.cliente}</strong>
                        <span className="badge confirmada">{r.estado}</span>
                      </div>
                      <div className="reserve-card-meta">
                        <span>{r.hora}</span>
                        <span>{r.personas} pers.</span>
                      </div>
                      {r.contactoTel && <p className="reserve-contact">{r.contactoTel}</p>}
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
                  ))}
                  {callingId && (
                    <div className="call-popup">
                      <div className="call-phone-icon">
                        <Icon name="phone" size={26} />
                      </div>
                      <strong>
                        Llamando a{' '}
                        {selectedReservations.find((r) => r.id === callingId)?.cliente}...
                      </strong>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="empty-state small">
            <div className="empty-icon">
              <Icon name="calendario" size={40} />
            </div>
            <h3>Selecciona un día</h3>
            <p>Haz clic en cualquier día del calendario para ver sus reservas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarView