const KEYS = [
  'aiden-users',
  'aiden-settings',
  'aiden-invoices',
  'aiden-inventario',
  'aiden-reservations',
]

// Descarga un archivo .json con todos los datos del sistema (usuarios, facturas,
// inventario con imágenes, reservas y configuración) para poder abrirlo en otra
// computadora.
export function exportarRespaldo() {
  const data = {}
  KEYS.forEach((k) => {
    try {
      data[k] = localStorage.getItem(k) ? JSON.parse(localStorage.getItem(k)) : null
    } catch {
      data[k] = null
    }
  })
  const blob = new Blob(
    [JSON.stringify({ app: "Aiden's System", version: 2, exportado: new Date().toISOString(), data }, null, 2)],
    { type: 'application/json' },
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `aidens-respaldo-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

// Lee y restaura un respaldo exportado. Devuelve la lista de secciones restauradas.
export async function importarRespaldo(file) {
  const texto = await file.text()
  const json = JSON.parse(texto)
  const datos = json && typeof json.data === 'object' ? json.data : json
  const restauradas = []
  KEYS.forEach((k) => {
    if (datos[k] != null) {
      localStorage.setItem(k, JSON.stringify(datos[k]))
      restauradas.push(k)
    }
  })
  if (restauradas.length === 0) {
    throw new Error('El archivo no contiene datos válidos de Aiden’s System.')
  }
  return restauradas
}