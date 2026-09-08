// Funciones de análisis puro en JavaScript para el dashboard administrativo.
// Nada de estos valores está hardcodeado; se derivan del arreglo de facturas.

export function calcularMetricas(invoices) {
  const totalFacturado = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0)
  const numFacturas = invoices.length
  const ticketPromedio = numFacturas > 0 ? totalFacturado / numFacturas : 0

  return { totalFacturado, numFacturas, ticketPromedio }
}

export function promedioYDesviacion(totales) {
  if (totales.length === 0) return { promedio: 0, desviacion: 0 }
  const promedio = totales.reduce((a, b) => a + b, 0) / totales.length
  const varianza =
    totales.reduce((acc, t) => acc + Math.pow(t - promedio, 2), 0) / totales.length
  const desviacion = Math.sqrt(varianza)
  return { promedio, desviacion }
}

// Marca como atípicas las facturas cuyo total se aleje más de 1.5 desviaciones estándar
// del promedio (por encima o por debajo).
export function detectarAtipicas(invoices) {
  const totales = invoices.map((inv) => Number(inv.total || 0))
  const { promedio, desviacion } = promedioYDesviacion(totales)
  const umbral = desviacion * 1.5

  return invoices.map((inv) => {
    const diff = Math.abs(Number(inv.total || 0) - promedio)
    return { ...inv, atipica: desviacion > 0 && diff > umbral }
  })
}

export function topClientes(invoices, n = 3) {
  const porCliente = {}
  invoices.forEach((inv) => {
    const nombre = inv.cliente || 'Sin cliente'
    porCliente[nombre] = (porCliente[nombre] || 0) + Number(inv.total || 0)
  })
  return Object.entries(porCliente)
    .map(([cliente, monto]) => ({ cliente, monto }))
    .sort((a, b) => b.monto - a.monto)
    .slice(0, n)
}

// Estado derivado: Pagada, Pendiente o Vencida comparando fecha de vencimiento con hoy.
// Una factura solo puede marcarse manualmente como "Pagada"; lo demás es automático.
export function derivarEstado(inv, hoy = new Date()) {
  if (inv.pagada) return 'Pagada'
  if (!inv.fechaVencimiento) return 'Pendiente'
  const venc = new Date(inv.fechaVencimiento + 'T23:59:59')
  const hoyMid = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return venc < hoyMid ? 'Vencida' : 'Pendiente'
}

export function conteoEstados(invoices) {
  const conteo = { Pagada: 0, Pendiente: 0, Vencida: 0 }
  invoices.forEach((inv) => {
    conteo[derivarEstado(inv)]++
  })
  return conteo
}

// Proyección simple de ingresos con promedio móvil de los últimos períodos.
export function proyectarIngresos(invoices, periodos = 3) {
  if (invoices.length === 0) return 0

  // Agrupar ingresos por período (mes) derivado de la fecha de emisión.
  const porPeriodo = {}
  invoices.forEach((inv) => {
    if (!inv.fecha) return
    const key = inv.fecha.slice(0, 7) // YYYY-MM
    if (!porPeriodo[key]) porPeriodo[key] = 0
    porPeriodo[key] += Number(inv.total || 0)
  })

  const periodosOrdenados = Object.keys(porPeriodo).sort()
  if (periodosOrdenados.length === 0) return 0

  // Tomar los últimos N períodos para el promedio móvil.
  const ultimos = periodosOrdenados.slice(-periodos)
  const suma = ultimos.reduce((acc, k) => acc + porPeriodo[k], 0)
  const mediaPeriodo = suma / ultimos.length

  return mediaPeriodo
}

// Datos para el gráfico de ingresos por período (barras/líneas).
export function ingresosPorPeriodo(invoices) {
  const porPeriodo = {}
  invoices.forEach((inv) => {
    if (!inv.fecha) return
    const key = inv.fecha.slice(0, 7)
    if (!porPeriodo[key]) porPeriodo[key] = 0
    porPeriodo[key] += Number(inv.total || 0)
  })
  return Object.entries(porPeriodo)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([periodo, ingresos]) => ({ periodo, ingresos: Math.round(ingresos * 100) / 100 }))
}

// Datos para el gráfico de distribución por cliente.
export function distribucionPorCliente(invoices) {
  const porCliente = {}
  invoices.forEach((inv) => {
    const nombre = inv.cliente || 'Sin cliente'
    porCliente[nombre] = (porCliente[nombre] || 0) + Number(inv.total || 0)
  })
  return Object.entries(porCliente).map(([cliente, monto]) => ({
    cliente,
    monto: Math.round(monto * 100) / 100,
  }))
}

import { formatColones } from './currency'

export function formatMoney(n) {
  return formatColones(n)
}
