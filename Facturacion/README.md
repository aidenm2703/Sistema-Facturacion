# Aiden's System (Sistema de Facturación)

Sistema de facturación interactivo construido en **React (Vite)** con una estética formal
(azul marino y dorado). El usuario crea su **cuenta de administrador**, selecciona su tipo de
negocio (productos y precios en **colones ₡**) y gestiona **empleados con permisos**, facturas,
pagos, inventario y reservas desde un dashboard con **sidebar**. Incluye la **Parte 2**:
un **panel de administración** con métricas, gráficos, detección de facturas atípicas, estados
de vencimiento y proyección de ingresos.

---

## Características

### Onboarding y accesos
- **Registro guiado**: nombre → **nombre de la empresa** → **usuario y contraseña de
  administrador** → tipo de negocio.
- **Inicio de sesión**: al haber cuentas creadas, el sistema pide usuario y contraseña
  (empleados y administrador con el mismo portal).
- **Cuentas**: el administrador crea, edita permisos y elimina empleados. Cada empleado
  inicia sesión y solo ve/usar las secciones que el admin le permitió (una cuenta admin siempre
  tiene acceso total).
- **Restablecer sistema**: desde la pantalla de login se pueden borrar todos los datos
  (usuarios, facturas, inventario y reservas) para empezar de cero.

### Negocio y moneda
- **11 tipos de negocio**: Bar, Cafetería, Peluquería, Restaurante, Tienda de Ropa,
  Tienda de Tecnología, Supermercado, Ferretería, Farmacia, Taller Mecánico y **Otros**.
- Cada tipo precarga **12 productos** (excepto *Otros*, que es manual) con **precios
  realistas en colones (₡)** y datos fiscales (RUC `/3-101-xxxxxx/`, IVA 13%).
- El formato de moneda es `₡12.500,00` (puntos para miles, coma para decimales).
- **Monograma** en cada tarjeta de negocio (letra + color) en lugar de emojis.

### Dashboard con sidebar
- 🏠 **Inicio** — bienvenida y accesos rápidos según permisos.
- ➕ **Crear factura** — formulario con ítems dinámicos, validación y **catálogo del
  inventario** (precio actual y existencias).
- 🧾 **Mis facturas** — listado con estado, vencimiento y selección para ver el diseño.
- 💳 **Pagos** — registro de cobros; estados Pagada/Pendiente/Vencida derivados.
- 📅 **Reservas** — reservas para varias personas, anticipo automático en ₡ y botón
  **Llamar** que simula una llamada al cliente.
- 🗓️ **Calendario** — calendario mensual conectado a las reservas; al hacer clic en un día
  se ven sus reservas, total de personas y se puede llamar/cancelar.
- 📦 **Inventario** — consulta de productos/existencias; el **admin** puede editar precio
  y stock (los empleados solo ven). Al facturar se **descuenta el stock**.
- 👥 **Usuarios** — solo admin; crea empleados y activa/desactiva cada permiso.
- 📊 **Panel Admin** — sección con permisos; métricas y analítica del negocio.
- **Persistencia local**: usuarios, sesión, ajustes, facturas, reservas e inventario usan
  `localStorage`/`sessionStorage`.
- Se carga una **factura de ejemplo** (TechStore S.A. → Juan Pérez) la primera vez.

---

## Panel de Administración (Parte 2)

### Métricas clave
- Total facturado acumulado, número total de facturas y ticket promedio.
- **Top 3 de clientes** según monto facturado.
- Todo se recalcula automáticamente con `useMemo` (nada hardcodeado).

### Gráficos (recharts)
- **Ingresos por período** (barras) — agrupación mensual por fechas reales.
- **Distribución por cliente** (pastel) — monto total por cliente.

### Detección de facturas atípicas
- Calcula **promedio** y **desviación estándar** de los totales.
- Marca las facturas cuyo total se aleje **más de 1.5 desviaciones estándar** del promedio.

### Estados de factura y alertas
- Cada factura tiene **emisión** y **vencimiento**; el estado **Pagada/Pendiente/Vencida**
  se **deriva** de la fecha. Lo único manual es marcar como "Pagada".

### Proyección simple de ingresos
- **Promedio móvil de los últimos 3 períodos (meses)**: se agrupa el total por mes, se
  toman los últimos 3 con facturas y se promedia. Se muestra como **estimación**.

### Reto analítico (dataset de prueba)
Desde **Inicio** (cuenta admin) puedes cargar **8 facturas de TechStore S.A.** en colones:
totales ₡93.600, ₡109.200, ₡101.400, **₡1.274.000 (atípica)**, ₡114.400, ₡91.000,
₡106.600 y ₡98.800. Vencimientos asignados para dejar **2 vencidas**, **1 pendiente** y el
resto pagadas. El panel detecta la factura atípica y muestra el conteo de los 3 estados.

---

## Ejecución

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente http://localhost:5173).

| Comando           | Descripción                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo        |
| `npm run build`   | Compila la aplicación para producción   |
| `npm run preview` | Previsualiza el build de producción     |
| `npm run lint`    | Ejecuta ESLint                          |

---

## Estructura del proyecto

```
src/
├── App.jsx                        # Onboarding, login y orquestación global
├── index.css                      # Reset global y variables de color
├── App.css                        # Estilos de toda la aplicación
├── data/
│   └── businessTypes.js           # 11 tipos de negocio con productos en ₡
├── utils/
│   ├── currency.js                # formatColones (₡12.500,00)
│   └── analytics.js               # Métricas, desviación, anomalías, ranking, proyección
└── components/
    ├── WelcomeScreen.jsx          # Pide el nombre
    ├── BusinessNameScreen.jsx     # Pide el nombre de la empresa
    ├── AccountSetup.jsx           # Crea la cuenta de administrador
    ├── LoginScreen.jsx            # Inicio de sesión (empleados/admin)
    ├── BusinessSelect.jsx         # Selección del tipo de negocio
    ├── Dashboard.jsx              # Layout con sidebar, permisos, inventario y navegación
    ├── Logo.jsx                   # Logo formal (monograma dorado)
    ├── Icon.jsx                   # Iconos SVG de trazo (sin emojis)
    ├── UsersManager.jsx           # Admin: crea empleados y edita permisos
    ├── Inventory.jsx              # Inventario (admin edita, empleado solo ve)
    ├── InvoiceForm.jsx            # Formulario de creación (useState, validación, ítems)
    ├── InvoiceList.jsx            # Listado (.map, key, estado vacío, selección)
    ├── Invoice.jsx                # Vista de factura (props, cálculos, estado derivado)
    ├── Payments.jsx               # Sistema de pagos
    ├── Reservations.jsx           # Reservas, personas, anticipo y llamada simulada
    ├── CalendarView.jsx           # Calendario mensual conectado a las reservas
    ├── AdminDashboard.jsx         # Panel admin (métricas, anomalías, estados, proyección)
    ├── MetricCard.jsx             # Tarjeta reutilizable de métrica
    ├── IngresosPeriodoChart.jsx   # Gráfico de barras (recharts)
    └── DistribucionClienteChart.jsx # Gráfico de pastel (recharts)
```

---

## Cumplimiento de requisitos

### Quiz Práctico #3
- **Formulario de creación** (30 pts): datos de emisor, cliente, número, fecha e ítems
  dinámicos con agregar/eliminar; `useState` y validación de campos requeridos y numéricos.
- **Listado de facturas** (25 pts): número, cliente, fecha y total con `.map()`/`key`,
  selección y estado vacío.
- **Diseño de la factura** (25 pts): componente `Invoice` por props, tabla de ítems y
  cálculo automático de subtotal, impuesto y total.
- **Ejercicio guiado** (10 pts): se precarga *TechStore S.A. → Juan Pérez*
  (Teclado ×2, Monitor ×1, Mouse ×3) con totales automáticos.
- **Calidad de código** (10 pts): componentes reutilizables y organizados.

### Quiz Práctico #4 (Parte 2)
- **Dashboard administrativo** (20 pts): métricas clave y top 3 de clientes con `useMemo`.
- **Gráficos** (25 pts): 2 gráficos con **recharts** (ingresos por período + distribución).
- **Facturas atípicas** (20 pts): promedio + desviación estándar, umbral 1.5σ, marcado y conteo.
- **Estados y alertas** (20 pts): vencimiento, estado derivado y conteo por estado.
- **Proyección** (15 pts): promedio móvil de los últimos 3 meses, marcada como estimación.