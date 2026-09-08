# 🧾 Facturador Express (Quiz Práctico #4)

Sistema de facturación interactivo construido en **React (Vite)**. El usuario elige su negocio,
se precargan productos y precios, y puede crear facturas, registrar pagos y gestionar reservas desde
un dashboard con **sidebar** (menú lateral). Incluye la **Parte 2**: un **panel de administración**
con métricas, gráficos, detección de facturas atípicas, estados de vencimiento y proyección de ingresos.

---

## ✨ Características

- **Onboarding interactivo**: al iniciar pide tu nombre y te da la bienvenida.
- **Selección de tipo de negocio**: Bar, Cafetería, Peluquería, Restaurante, Tienda, Taller o General.
  Al elegir uno se cargan automáticamente productos con precios y datos de la empresa.
- **Dashboard con menú lateral (sidebar)**:
  - 🏠 **Inicio** — bienvenida y accesos rápidos.
  - ➕ **Nueva factura** — formulario con ítems dinámicos, validación y catálogo de productos.
  - 🧾 **Mis facturas** — listado con estado, vencimiento y selección para ver el diseño.
  - 💳 **Pagos** — registro de cobros; estados Pagada/Pendiente/Vencida derivados.
  - 📅 **Reservas** — agrega reservas indicando **para cuántas personas**, con anticipo automático
    y botón **📞 Llamar** que simula una llamada al cliente.
  - 🗓️ **Calendario** — calendario mensual conectado a las reservas; al hacer clic en un día se ven
    sus reservas, el total de personas y se puede llamar/cancelar.
  - 📊 **Panel Admin** — sección exclusiva (rol administrador, contraseña `admin123`).
- **Persistencia local** con `localStorage`.
- Se carga una **factura de ejemplo** (TechStore S.A. → Juan Pérez) la primera vez.

---

## 📊 Panel de Administración (Parte 2)

### Métricas clave
- Total facturado acumulado, número total de facturas y ticket promedio
  (total facturado ÷ número de facturas).
- **Top 3 de clientes** según monto facturado (🥇🥈🥉).
- Todo se recalcula automáticamente con `useMemo` a partir del arreglo de facturas
  (nada hardcodeado).

### Gráficos (recharts)
- **Ingresos por período** (barras) — agrupación mensual derivada de las fechas reales.
- **Distribución por cliente** (pastel) — monto total por cliente.

### Detección de facturas atípicas
- Calcula **promedio** y **desviación estándar** de los totales.
- Marca (🚩) las facturas cuyo total se aleje **más de 1.5 desviaciones estándar** del promedio.
- El dashboard indica cuántas facturas fueron marcadas.

### Estados de factura y alertas
- Cada factura tiene **fecha de emisión** y **fecha de vencimiento**.
- El estado **Pagada / Pendiente / Vencida** se **deriva** comparando la fecha de vencimiento con la
  fecha actual. Lo único manual es marcar como "Pagada".
- Conteo de facturas por estado y badge de estado en facturas y listado.

### Proyección simple de ingresos
- Se calcula con un **promedio móvil de los últimos 3 períodos (meses)**:
  1. Agrupar el total facturado por mes (`fecha.slice(0,7)`).
  2. Ordenar los meses.
  3. Tomar los últimos 3 meses con facturas, sumar sus ingresos y dividir entre 3.
- Se muestra en el dashboard dejando claro que es una **estimación**, no un dato real.

### Reto analítico (dataset de prueba)
Desde **Inicio** o **Panel Admin** puedes cargar el dataset de **8 facturas de TechStore S.A.**
con totales $180, $210, $195, **$2,450 (atípica)**, $220, $175, $205 y $190.
Las fechas de vencimiento se asignan para dejar **2 vencidas**, **1 pendiente** y el resto pagadas.
El dashboard detecta $2,450 como atípica y muestra correctamente el conteo de los 3 estados.

---

## 🚀 Ejecución

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente http://localhost:5173).

### Comandos

| Comando          | Descripción                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Inicia el servidor de desarrollo    |
| `npm run build`  | Compila la aplicación para producción |
| `npm run preview`| Previsualiza el build de producción |
| `npm run lint`   | Ejecuta ESLint                      |

---

## 🧩 Estructura del proyecto

```
src/
├── App.jsx                        # Orquesta onboarding → dashboard
├── index.css                      # Reset global y variables
├── App.css                        # Estilos de toda la aplicación
├── data/
│   └── businessTypes.js           # Tipos de negocio con productos pre cargados
├── utils/
│   └── analytics.js               # Métricas, desviación, anomalías, ranking, proyección
└── components/
    ├── WelcomeScreen.jsx          # Pide el nombre y da la bienvenida
    ├── BusinessSelect.jsx         # Selección del tipo de negocio
    ├── Dashboard.jsx              # Layout con sidebar, navegación y estado
    ├── InvoiceForm.jsx            # Formulario de creación (useState, validación, ítems dinámicos)
    ├── InvoiceList.jsx            # Listado (.map, key, estado vacío, selección, estado/vencimiento)
    ├── Invoice.jsx                # Vista de factura (props, cálculos, estado derivado)
    ├── Payments.jsx               # Sistema de pagos (deriva estado Pagada/Pendiente/Vencida)
    ├── Reservations.jsx           # Reservas, personas, anticipo y llamada simulada
    ├── CalendarView.jsx           # Calendario mensual conectado a las reservas
    ├── AdminDashboard.jsx         # Panel admin (métricas, anomalías, estados, proyección)
    ├── MetricCard.jsx             # Tarjeta reutilizable de métrica
    ├── IngresosPeriodoChart.jsx   # Gráfico de barras (recharts)
    └── DistribucionClienteChart.jsx # Gráfico de pastel (recharts)
```

---

## 🎯 Cumplimiento de requisitos

### Quiz Práctico #3
- **Formulario de creación** (30 pts): datos de emisor, cliente, número, fecha y ítems dinámicos
  con agregar/eliminar; estado con `useState` y validación de campos requeridos y numéricos.
- **Listado de facturas** (25 pts): muestra número, cliente, fecha y total con `.map()` y `key`,
  permite seleccionar y maneja el estado vacío.
- **Diseño de la factura** (25 pts): componente `Invoice` por props, tabla de ítems y cálculo
  automático de subtotal, impuesto y total con diseño profesional en CSS.
- **Ejercicio guiado** (10 pts): se precarga la factura de ejemplo *TechStore S.A. → Juan Pérez*
  (Teclado ×2, Monitor ×1, Mouse ×3) con totales calculados automáticamente.
- **Calidad de código** (10 pts): componentes reutilizables y organizados.

### Quiz Práctico #4 (Parte 2)
- **Dashboard administrativo** (20 pts): métricas clave y top 3 de clientes recalculados con
  `useMemo` desde el arreglo de facturas.
- **Gráficos** (25 pts): 2 gráficos con **recharts** (ingresos por período + distribución por
  cliente) alimentados por datos reales.
- **Facturas atípicas** (20 pts): promedio + desviación estándar, umbral de 1.5σ, marcado visual
  y conteo.
- **Estados y alertas** (20 pts): fecha de vencimiento, estado derivado (Pagada/Pendiente/Vencida)
  y conteo por estado.
- **Proyección** (15 pts): promedio móvil de los últimos 3 meses, marcada como estimación.