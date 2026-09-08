import { useMemo, useState } from 'react'
import MetricCard from './MetricCard'
import IngresosPeriodoChart from './IngresosPeriodoChart'
import DistribucionClienteChart from './DistribucionClienteChart'
import {
  calcularMetricas,
  detectarAtipicas,
  topClientes,
  conteoEstados,
  proyectarIngresos,
  ingresosPorPeriodo,
  distribucionPorCliente,
  formatMoney,
} from '../utils/analytics'

function AdminDashboard({ invoices, onViewInvoice, onLoadTestData }) {
  // Barrera de rol administrador
  const [authorized, setAuthorized] = useState(
    () => sessionStorage.getItem('admin-auth') === 'yes',
  )
  const [pw, setPw] = useState('')

  const entrar = (e) => {
    e.preventDefault()
    if (pw === 'admin123') {
      sessionStorage.setItem('admin-auth', 'yes')
      setAuthorized(true)
    } else {
      alert('Contraseña incorrecta. Pista: admin123')
    }
  }

  const cerrar = () => {
    sessionStorage.removeItem('admin-auth')
    setAuthorized(false)
  }

  return authorized ? (
    <AdminContent
      invoices={invoices}
      onViewInvoice={onViewInvoice}
      onLoadTestData={onLoadTestData}
      onLogout={cerrar}
    />
  ) : (
      <div className="admin-login">
        <div className="admin-login-card">
          <h2>🔐 Panel de Administración</h2>
          <p>
            Esta sección es exclusiva para el administrador. Ingresa la contraseña para
            ver el panorama completo del negocio.
          </p>
          <form onSubmit={entrar}>
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-block">
              Entrar al panel
            </button>
          </form>
        </div>
      </div>
    )
}

function AdminContent({ invoices, onViewInvoice, onLoadTestData, onLogout }) {
  // Cálculo derivado con useMemo: se actualiza automáticamente cuando cambian las facturas.
  const {
    metricas,
    datosAtipicos,
    top,
    estados,
    proyeccion,
    dataPeriodo,
    dataCliente,
    statsTotales,
  } = useMemo(() => {
    const metricas = calcularMetricas(invoices)
    const datosAtipicos = detectarAtipicas(invoices)
    const atipicas = datosAtipicos.filter((i) => i.atipica)
    const top = topClientes(invoices, 3)
    const estados = conteoEstados(invoices)
    const proyeccion = proyectarIngresos(invoices, 3)
    return {
      metricas,
      datosAtipicos,
      top,
      estados,
      proyeccion,
      dataPeriodo: ingresosPorPeriodo(invoices),
      dataCliente: distribucionPorCliente(invoices),
      statsTotales: {
        cantidadAtipicas: atipicas.length,
        promedio: calcularMetricas(invoices).ticketPromedio,
      },
    }
  }, [invoices])

  return (
    <div className="admin-dashboard">
      <div className="admin-head">
        <div>
          <h2>📊 Panel de Administración</h2>
          <p className="subtitle">Panorama completo del negocio · rol administrador</p>
        </div>
        <div className="admin-actions">
          {onLoadTestData && (
            <button type="button" className="btn btn-ghost" onClick={onLoadTestData}>
              🧪 Cargar dataset de prueba
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onLogout}
          >
            Cerrar sesión admin
          </button>
        </div>
      </div>

      {/* Métricas clave */}
      <div className="metric-grid">
        <MetricCard
          label="Total facturado"
          value={formatMoney(metricas.totalFacturado)}
          icon="💰"
          color="#16a34a"
          sub={`${metricas.numFacturas} factura(s)`}
        />
        <MetricCard
          label="N° de facturas"
          value={metricas.numFacturas}
          icon="🧾"
          color="#4f46e5"
        />
        <MetricCard
          label="Ticket promedio"
          value={formatMoney(metricas.ticketPromedio)}
          icon="🎫"
          color="#9333ea"
        />
        <MetricCard
          label="Proyección de ingresos"
          value={formatMoney(proyeccion)}
          icon="📈"
          color="#ea580c"
          sub="estimación del siguiente período"
        />
      </div>

      {/* Top clientes */}
      <div className="metric-grid">
        {top.map((c, i) => (
          <MetricCard
            key={c.cliente}
            label={`Top ${i + 1} cliente`}
            value={c.cliente}
            icon={['🥇', '🥈', '🥉'][i] || '⭐'}
            color={['#f59e0b', '#94a3b8', '#b45309'][i]}
            sub={formatMoney(c.monto)}
          />
        ))}
      </div>

      {/* Estados */}
      <div className="status-bar">
        <div className="status-chip pagada">✓ {estados.Pagada} Pagada</div>
        <div className="status-chip pendiente">⏳ {estados.Pendiente} Pendiente</div>
        <div className="status-chip vencida">⚠️ {estados.Vencida} Vencida</div>
        <div className="status-chip atipica">🚩 {statsTotales.cantidadAtipicas} Atípica(s)</div>
      </div>

      {/* Gráficos */}
      <div className="chart-grid">
        <IngresosPeriodoChart data={dataPeriodo} />
        <DistribucionClienteChart data={dataCliente} />
      </div>

      {/* Facturas atípicas */}
      <div className="admin-section">
        <h3>
          Facturas con detección de anomalías{' '}
          <span className="badge-count">{statsTotales.cantidadAtipicas}</span>
        </h3>
        <p className="chart-empty-note">
          Promedio: {formatMoney(statsTotales.promedio)}. Se marcan las facturas que se
          alejan más de 1.5 desviaciones estándar del promedio.
        </p>
        <div className="anomaly-list">
          {datosAtipicos.map((inv) => (
            <div key={inv.id} className={`anomaly-row ${inv.atipica ? 'marked' : ''}`}>
              <div className="anomaly-info">
                <strong>
                  {inv.emisor} → {inv.cliente}
                </strong>
                <span>
                  N° {inv.numero} · {inv.fecha}
                </span>
              </div>
              <div className="anomaly-amount">{formatMoney(inv.total)}</div>
              {inv.atipica ? (
                <span className="anomaly-tag">🚩 Atípica</span>
              ) : (
                <span className="anomaly-tag ok">Normal</span>
              )}
              {onViewInvoice && (
                <button
                  type="button"
                  className="btn btn-ghost-small"
                  onClick={() => onViewInvoice(inv)}
                >
                  Ver
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Proyección */}
      <div className="admin-section projection">
        <h3>📈 Proyección de ingresos</h3>
        <p>
          La proyección estimada para el siguiente período es de{' '}
          <strong>{formatMoney(proyeccion)}</strong>.
        </p>
        <p className="projection-note">
          <em>
            Estimación calculada con un promedio móvil de los últimos 3 períodos
            (meses): se suman los ingresos de los últimos meses con facturas y se divide
            entre la cantidad de esos meses. No es un dato real.
          </em>
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
