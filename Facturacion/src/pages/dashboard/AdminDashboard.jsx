import { useMemo } from 'react'
import { MetricCard } from '../../components'
import { IngresosPeriodoChart } from '../../components'
import { DistribucionClienteChart } from '../../components'
import { VentasPorDiaChart } from '../../components'
import {
  calcularMetricas,
  detectarAtipicas,
  topClientes,
  conteoEstados,
  proyectarIngresos,
  ingresosPorPeriodo,
  distribucionPorCliente,
  ventasPorDia,
  ventasPorSemana,
  ventasPorDiaSemana,
  mejorDiaDeVenta,
  formatMoney,
} from '../../utils'
import { Icon } from '../../components'

function AdminDashboard({ invoices, onViewInvoice, onLoadTestData }) {
  return (
    <AdminContent
      invoices={invoices}
      onViewInvoice={onViewInvoice}
      onLoadTestData={onLoadTestData}
    />
  )
}

function AdminContent({ invoices, onViewInvoice, onLoadTestData }) {
  // Cálculo derivado con useMemo: se actualiza automáticamente cuando cambian las facturas.
  const {
    metricas,
    datosAtipicos,
    top,
    estados,
    proyeccion,
    dataPeriodo,
    dataCliente,
    dataDia,
    dataSemana,
    dataDiaSemana,
    mejorDia,
    statsTotales,
  } = useMemo(() => {
    const metricasNow = calcularMetricas(invoices)
    const datosAtipicos = detectarAtipicas(invoices)
    const atipicas = datosAtipicos.filter((i) => i.atipica)
    const top = topClientes(invoices, 3)
    const estados = conteoEstados(invoices)
    const proyeccion = proyectarIngresos(invoices, 3)
    return {
      metricas: metricasNow,
      datosAtipicos,
      top,
      estados,
      proyeccion,
      dataPeriodo: ingresosPorPeriodo(invoices),
      dataCliente: distribucionPorCliente(invoices),
      dataDia: ventasPorDia(invoices),
      dataSemana: ventasPorSemana(invoices),
      dataDiaSemana: ventasPorDiaSemana(invoices),
      mejorDia: mejorDiaDeVenta(invoices),
      statsTotales: {
        cantidadAtipicas: atipicas.length,
        promedio: metricasNow.ticketPromedio,
      },
    }
  }, [invoices])

  return (
    <div className="admin-dashboard">
      <div className="admin-head">
        <div>
          <h2>Panel de Administración</h2>
          <p className="subtitle">Panorama completo del negocio · perfil administrador</p>
        </div>
        {onLoadTestData && (
          <button type="button" className="btn btn-ghost" onClick={onLoadTestData}>
            <Icon name="invoices" size={16} /> Cargar dataset de prueba
          </button>
        )}
      </div>

      {/* Métricas clave */}
      <div className="metric-grid">
        <MetricCard
          label="Total facturado"
          value={formatMoney(metricas.totalFacturado)}
          icon={<Icon name="invoices" size={20} />}
          color="#1b2b4f"
          sub={`${metricas.numFacturas} factura(s)`}
        />
        <MetricCard
          label="N° de facturas"
          value={metricas.numFacturas}
          icon={<Icon name="create" size={20} />}
          color="#c9a227"
        />
        <MetricCard
          label="Ticket promedio"
          value={formatMoney(metricas.ticketPromedio)}
          icon={<Icon name="payments" size={20} />}
          color="#2c3e6b"
        />
        <MetricCard
          label="Proyección de ingresos"
          value={formatMoney(proyeccion)}
          icon={<Icon name="panel" size={20} />}
          color="#8a6d1d"
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
            icon={<Icon name="usuarios" size={20} />}
            color={['#c9a227', '#8a6d1d', '#66739b'][i]}
            sub={formatMoney(c.monto)}
          />
        ))}
      </div>

      {/* Estados */}
      <div className="status-bar">
        <div className="status-chip pagada">
          <Icon name="check" size={14} /> {estados.Pagada} Pagada
        </div>
        <div className="status-chip pendiente">
          <Icon name="clock" size={14} /> {estados.Pendiente} Pendiente
        </div>
        <div className="status-chip vencida">
          <Icon name="alert" size={14} /> {estados.Vencida} Vencida
        </div>
        <div className="status-chip atipica">
          <Icon name="settings" size={14} /> {statsTotales.cantidadAtipicas} Atípica(s)
        </div>
      </div>

      {/* Gráficos */}
      <div className="chart-grid">
        <IngresosPeriodoChart data={dataPeriodo} />
        <DistribucionClienteChart data={dataCliente} />
      </div>

      {/* Ventas por día y por semana */}
      <div className="admin-section sales-by-day">
        <div className="sales-by-day-head">
          <h3>Ventas por día y por semana</h3>
          <div className="best-day-chip" title="Día de la semana con más ventas">
            <Icon name="inventario" size={14} /> Mejor día: <strong>{mejorDia.dia || '—'}</strong>
            <span className="best-day-amount">
              {mejorDia.ingresos > 0 ? formatMoney(mejorDia.ingresos) : 'Sin ventas'}
            </span>
          </div>
        </div>
        <div className="day-week-grid">
          <VentasPorDiaChart data={dataDia} />
          <div className="week-panel">
            <div className="week-panel-head">
              <h4>Ventas por semana</h4>
              <small>cada barra es una semana (lunes a domingo)</small>
            </div>
            <div className="week-list">
              {dataSemana.length > 0 ? (
                dataSemana.map((w) => {
                  const max = Math.max(...dataSemana.map((x) => x.ingresos))
                  const pct = max > 0 ? (w.ingresos / max) * 100 : 0
                  return (
                    <div key={w.semana} className="week-row">
                      <span className="week-label">Semana del {w.semana}</span>
                      <span className="week-bar-track">
                        <span className="week-bar" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="week-amount">{formatMoney(w.ingresos)}</span>
                    </div>
                  )
                })
              ) : (
                <p className="chart-empty">Sin datos</p>
              )}
            </div>
            <div className="weekday-list">
              <div className="week-panel-head">
                <h4>Día que más vende</h4>
              </div>
              {dataDiaSemana.map((d) => (
                <div key={d.dia} className={`weekday-row ${d.dia === mejorDia.dia ? 'best' : ''}`}>
                  <span>{d.dia}</span>
                  <span className="week-amount">
                    {formatMoney(d.ingresos)}
                    {d.facturas > 0 && <small> · {d.facturas} fact.</small>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                <span className="anomaly-tag">Atípica</span>
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
        <h3>Proyección de ingresos</h3>
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