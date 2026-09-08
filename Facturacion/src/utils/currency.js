// Formato de moneda en colones costarricenses (₡)
// Ejemplo de salida: ₡12.500,00
export function formatColones(n) {
  const v = Number(n || 0)
  const neg = v < 0 ? '-' : ''
  const [i, d] = Math.abs(v).toFixed(2).split('.')
  const grouped = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return neg + '₡' + grouped + ',' + d
}