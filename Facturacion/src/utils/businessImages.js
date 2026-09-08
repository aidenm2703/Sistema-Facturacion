// Pictogramas SVG dibujados por línea (sin emojis) para negocios y productos.
// Cada entrada devuelve el "interior" del <svg viewBox="0 0 24 24">.
const MARK_PATHS = {
  bar() {
    return `
      <path d="M7 4h10l-5 8z"/>
      <path d="M8.6 6.8h6.8"/>
      <path d="M12 12v6"/>
      <path d="M9 18h6"/>
      <path d="M13.2 4.6l2.4 4.6"/>`
  },
  cafeteria() {
    return `
      <path d="M6 8.5h10v3.5a5 5 0 0 1-10 0z"/>
      <path d="M16 9.7h1.4a1.8 1.8 0 0 1 0 3.6H16"/>
      <path d="M7.5 17.2h7"/>
      <path d="M8.2 5.6c0-1 1.2-1 1.2-2.2"/>
      <path d="M11.4 5.6c0-1 1.2-1 1.2-2.2"/>`
  },
  peluqueria() {
    return `
      <rect x="5" y="8" width="14" height="6" rx="1.5"/>
      <path d="M6.5 8V4.5M10 8V4.5M13.5 8V4.5M17 8V4.5"/>
      <path d="M6 17h12"/>`
  },
  restaurante() {
    return `
      <path d="M8.5 4v7.2a2.1 2.1 0 0 0 4.2 0V4"/>
      <path d="M7 4h7.2"/>
      <path d="M10.6 11.2V20"/>
      <path d="M15.5 4.5c-1 1-1.5 2.5-1.4 4l1.3 11.5"/>
      <path d="M20.5 4.9l-1.3 15.1"/>`
  },
  'tienda-ropa'() {
    return `
      <path d="M9 5L3.5 8 6 12l2-1.4V19h8v-8.4L18 12l2.5-4L15 5a3.1 3.1 0 0 1-6 0z"/>`
  },
  'tienda-tecnologia'() {
    return `
      <rect x="4" y="5" width="16" height="11" rx="1.5"/>
      <rect x="6" y="7" width="12" height="7" rx="0.5"/>
      <path d="M3 20h18"/>
      <path d="M7.5 20l1.6-4h5.8l1.6 4"/>`
  },
  supermercado() {
    return `
      <path d="M4 5.5h3l1.6 11.5h9l1.9-8H7.5"/>
      <path d="M8.5 12h6.5"/>
      <circle cx="9.5" cy="19.2" r="1.3"/>
      <circle cx="16.3" cy="19.2" r="1.3"/>`
  },
  ferreteria() {
    return `
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 3.8V6M12 18v2.2M3.8 12H6M18 12h2.2M6.4 6.4L8 8M16 16l1.6 1.6M17.6 6.4L16 8M8 16l-1.6 1.6"/>`
  },
  farmacia() {
    return `
      <rect x="9.5" y="4" width="5" height="16" rx="1"/>
      <rect x="4" y="9.5" width="16" height="5" rx="1"/>
      <circle cx="18" cy="18.2" r="2"/>`
  },
  taller() {
    return `
      <path d="M4 16.4l1.8-4.8A2 2 0 0 1 7.6 10h8.8a2 2 0 0 1 1.8 1.6l1.8 4.8v3.4a1.1 1.1 0 0 1-1.1 1.1h-1a1.1 1.1 0 0 1-1.1-1.1V17.5H6.2v2.7a1.1 1.1 0 0 1-1.1 1.1h-1A1.1 1.1 0 0 1 4 19.8z"/>
      <circle cx="8" cy="15.2" r="1"/>
      <circle cx="16" cy="15.2" r="1"/>`
  },
  general() {
    return `
      <path d="M3 7.5l9-3.2 9 3.2v9.8l-9 3.2-9-3.2z"/>
      <path d="M3 7.5l9 3.2 9-3.2"/>
      <path d="M12 10.7V20"/>`
  },
}

export function markSvg(id) {
  return MARK_PATHS[id]?.() || MARK_PATHS.general()
}