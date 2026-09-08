# Documentación del Sistema de Facturación — Aiden's System

Este documento explica cómo está construida la aplicación, qué se implementó en cada etapa,
cómo están organizados el código y los datos, y las mejoras añadidas más allá de los requisitos
de los quices. Complementa al `README.md` (que documenta los requisitos de aprobación).

---

## 1. Qué es el sistema

Un sistema de facturación **100% en el navegador** (React + Vite) que no necesita servidor:
todos los datos viven en el `localStorage` del navegador. Es ideal para un negocio pequeño que
quiere llevar facturas, cobros, inventario y reservas con estética formal (azul marino y dorado)
y moneda en **colones (₡)**.

Al abrir por primera vez, el sistema guía al usuario en un **registro por pasos**:
nombre → nombre de la empresa → cuenta de administrador → tipo de negocio (11 opciones).
Cada tipo carga sus productos, precios en ₡ y datos fiscales (RUC e IVA 13%).

---

## 2. Etapas de implementación

### 2.1 Quiz Práctico #3 (base funcional)
- **Registro guiado** con pantallas separadas en flujo (`WelcomeScreen`, `BusinessNameScreen`,
  `AccountSetup`, `BusinessSelect`).
- **Inicio de sesión** para admin y empleados (`LoginScreen`).
- **Formulario de factura** (`InvoiceForm`) con ítems dinámicos, validación de campos requeridos
  y numéricos, cálculo de subtotal, IVA (13%) y total.
- **Listado de facturas** (`InvoiceList`) con `.map()`/`key`, estado vacío y selección.
- **Diseño de factura** (`Invoice`) que recibe datos por props y calcula totales automáticamente,
  con estado *Pagada/Pendiente/Vencida* **derivado de las fechas**.
- **Factura de ejemplo** precargada: TechStore S.A. → Juan Pérez (Teclado ×2, Monitor ×1, Mouse ×3).
- **Persistencia local** de usuarios, sesión, ajustes, facturas, reservas e inventario.

### 2.2 Quiz Práctico #4 (Panel de Administración)
- **Métricas clave** (total facturado, conteo de facturas, ticket promedio) y **Top 3 de clientes**,
  todo recalculado con `useMemo`.
- **Gráficos con recharts**: ingresos por período (barras agrupadas por mes real) y distribución
  por cliente (pastel).
- **Detección de facturas atípicas**: promedio + desviación estándar; se marcan las facturas que
  se alejan **más de 1.5σ** del promedio.
- **Estados y conteo de alertas**: vencidas, pendientes y pagadas (derivado de fechas).
- **Proyección de ingresos**: promedio móvil de los últimos 3 meses con facturas, marcada como
  "estimación".
- **Dataset de prueba**: 8 facturas de TechStore S.A. (una atípica de ₡1.274.000) cargable desde
  Inicio para validar el análisis.

### 2.3 Mejoras añadidas
- **Sonido y lectura por voz (TTS)**: timbre al guardar/pagar y saludo leído en la bienvenida;
  conmutador para activar/desactivar.
- **Corrección del "Restablecer sistema"**: al restablecer se limpian datos y **también se vuelve
  a mostrar el onboarding** del tipo de negocio.
- **Señal (recordatorio) en reservas**: campo opcional que indica requerimiento de señal.
- **Pantallas Acerca de (¿Quiénes somos?) y Ayuda**: accesibles desde el sidebar para todos los
  usuarios; la Ayuda muestra tarjetas de soporte con teléfono, correo y horario completos en una
  sola línea, con acciones simuladas de llamar/enviar correo.
- **Toasts en lugar de `alert()`/`confirm()`**: todo el sistema notifica con *toasts* discretos.
  Las acciones destructivas (borrar empleado, restablecer sistema) usan **doble confirmación**.
- **Logotipos por tipo de negocio**: pictogramas **SVG dibujados por código** (`BusinessMark`)
  que se ven igual en cualquier computadora (antes eran letras en un monograma; no dependen de
  emojis ni de imágenes externas). Se reutilizan en selección de negocio, bienvenida, productos
  y listado del catálogo.
- **Imágenes por producto**: el admin puede subir una foto por producto en el inventario. Las
  imágenes se **comprimen a 420px (JPEG, calidad 0.7)** para no exceder el espacio del navegador,
  y se muestran en inventario y catálogo de la factura.
- **Respaldo de datos**: desde Usuarios (solo admin) se puede **Exportar respaldo** (descarga un
  JSON con todas las claves) y **Restaurar respaldo** (sube el archivo y recarga los datos). Es la
  forma de trasladar el sistema a otra computadora.
- **Analítica de ventas por día/semana** en el Panel Admin: total por día, total por semana y el
  **mejor día de la semana** destacado, con su propio gráfico de barras.
- **Gráficos legibles**: las etiquetas del pastel de clientes ya no se superponen (se ordenan,
  recortan y muestran en tooltip con porcentaje), y el eje de fechas rota las etiquetas para que
  se lean aunque haya muchas facturas.

---

## 3. Arquitectura y organización

### 3.1 Organización en carpetas
Todo el código está **modulado por dominio**:

```
src/
├── data/                 # Datos estáticos (tipos de negocio y productos)
├── utils/                # Lógica reutilizable (moneda, analítica, sonido, toasts…)
└── components/
    ├── layout/           # Dashboard, logo, íconos, pictogramas, contenedor de toasts
    ├── onboarding/       # Primera vez: nombre, empresa, cuenta, tipo de negocio
    ├── invoices/         # Crear, listar y ver facturas
    ├── payments/         # Cobros y pagos
    ├── reservations/     # Reservas y calendario
    ├── inventory/        # Inventario con imágenes de producto
    ├── users/            # Gestión de empleados, permisos y respaldo
    ├── admin/            # Panel de administración y gráficos
    └── info/             # Acerca de y Ayuda
```

### 3.2 Utilidades (`src/utils`)
| Archivo        | Responsabilidad                                                               |
| -------------- | ----------------------------------------------------------------------------- |
| `currency.js`  | `formatColones` — formatea montos como `₡12.500,00`.                          |
| `analytics.js` | Métricas, desviación estándar, anomalías (1.5σ), ranking, proyección, ventas por día/semana. |
| `sound.js`     | Timbre, lectura por voz (TTS) y preferencia de sonido.                        |
| `toast.js`     | Cola de notificaciones *toast* mediante eventos (`CustomEvent('aiden-toast')`). |
| `storage.js`   | `compressImage` (redimensionar a 420px) y `guardarLocalJson` (con manejo de errores de cuota). |
| `backup.js`    | `exportarRespaldo` / `importarRespaldo` en un archivo JSON único.             |

#### Barrels (punto único de exports/imports)
Cada carpeta de módulos contiene un `index.js` (barrel) que **centraliza los exports** con
nombres explícitos. De esta forma todos los `imports` se hacen desde un solo lugar, sin rutas
profundas. Regla de imports:

- Misma carpeta → ruta directa: `import Btn from './Btn'`.
- Otra carpeta de componentes → barrel de componentes: `import { Dashboard } from '../index'`
  (o desde el barrel raíz `src/components`).
- Utilidades → barrel: `import { formatColones, toast } from '../../utils'`.
- Datos → barrel: `import { businessTypes } from '../../data'`.

### 3.3 Datos (localStorage/sessionStorage)
| Clave               | Guarda                                        | Ámbito          |
| ------------------- | --------------------------------------------- | --------------- |
| `aiden-users`       | Cuentas de admin y empleados con permisos     | `localStorage`  |
| `aiden-settings`    | Ajustes (tipo de negocio, empresa, sonido…)   | `localStorage`  |
| `aiden-invoices`    | Facturas y su estado editable                 | `localStorage`  |
| `aiden-inventario`  | Productos con precio, stock e imagen          | `localStorage`  |
| `aiden-reservations`| Reservas y señales                            | `localStorage`  |
| `aiden-session`     | Sesión del usuario actual                     | `sessionStorage`|

### 3.4 Roles y permisos
- **admin**: acceso total (Usuarios y Panel Admin solo para admin).
- **empleado**: solo ve/usar las secciones que el admin le permitió (`facturar`, `cobrar`,
  `inventario`, `reservas`, `panel`).
- Las secciones **Acerca de** y **Ayuda** son visibles para todos.

---

## 4. Cómo mover el sistema a otra computadora

> Este proyecto **no usa un archivo `db.json` ni una base de datos**: es 100% cliente y los
> datos viven en `localStorage`/`sessionStorage` (claves `aiden-*`). Por eso el único medio de
> persistencia/traslado es el respaldo JSON descrito aquí.

1. En **Usuarios** (cuenta admin) → **Exportar respaldo** → se descarga `aidens-respaldo-<fecha>.json`.
2. En la otra computadora, abrir la app, crear una cuenta y luego **Restaurar respaldo**
   seleccionando el archivo descargado.
3. El sistema recarga automáticamente con los usuarios, facturas, inventario y reservas anteriores.

> Nota: las fotos de producto se guardan comprimidas (máx. 420px) para que un respaldo incluye
> un negocio real sin agotar el límite de almacenamiento del navegador (~5 MB).

---

## 5. Comandos útiles

| Comando           | Descripción                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (puerto 5173)  |
| `npm run build`   | Compila producción en `dist/`         |
| `npm run preview` | Previsualiza el build                 |
| `npm run lint`    | ESLint sobre todo el código           |

---

## 6. Notas de calidad

- Sin emojis en el texto de la interfaz (los íconos son SVG de trazo; `✕` se usa como cierre).
- Sin librerías de terceros no necesarias: React + recharts + Vite.
- Componentes reutilizables (`Icon`, `Logo`, `MetricCard`, `Toaster`, `BusinessMark`).
- Validación de formularios y estados vacíos de listas.
- Horario, teléfono y correo de Ayuda se muestran completos en una sola línea; en pantallas muy
  angostas (<560px) las tarjetas de contacto se apilan sin cortar el contenido.