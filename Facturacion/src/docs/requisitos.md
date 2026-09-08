Construir una aplicación en React que permita crear facturas a partir de datos ingresados por el
usuario, visualizarlas en un listado y renderizar el diseño de una factura individual con la
información capturada. El estudiante debe demostrar manejo de estado, componentes, props,
renderizado condicional y estructuración de la interfaz.
Importante: Este trabajo es INDIVIDUAL . Cualquier copia total o parcial entre estudiantes
anula la calificación de todos los involucrados.

Contexto
Una pequeña empresa necesita una herramienta interna para emitir facturas. El usuario (un
empleado) debe poder ingresar los datos de una factura mediante un formulario. Al guardar, la
factura se agrega a una lista y puede visualizarse con un diseño limpio y profesional.
Requerimientos funcionales
1. Formulario de creación de factura (30 pts)
El usuario debe poder ingresar como mínimo:
Datos del emisor: nombre de la empresa, RUC/NIT/ID fiscal.
Datos del cliente: nombre, dirección/correo.
Número de factura y fecha de emisión.
Lista dinámica de ítems (productos/servicios): descripción, cantidad y precio unitario. Debe poder
agregar y eliminar filas de ítems.
D E S A R R O L L O F R O N T - E N D · R E A C T

Sistema de Manipulación de Facturas
MODALIDAD FRAMEWORK DURACIÓN SUGERIDA PUNTAJE

El estado del formulario debe manejarse con useState . Debe existir validación básica (campos
requeridos y cantidades/precios numéricos).
2. Listado de facturas (25 pts)
Mostrar todas las facturas creadas (número, cliente, fecha y total).
Renderizar la lista con .map() y una key adecuada.
Permitir seleccionar una factura para ver su diseño completo.
Manejar el estado vacío ("No hay facturas registradas").
3. Diseño / vista de la factura (25 pts)
Componente Invoice que reciba los datos por props y renderice el diseño de la factura.
Encabezado con emisor y cliente, tabla de ítems, y cálculo automático de subtotal, impuesto
(ej. IVA/impuesto configurable) y total.
Diseño ordenado y legible mediante CSS (layout, tipografía y espaciado). Debe verse como una
factura real.
4. Ejercicio guiado: factura con datos ingresados (10 pts)
Crear al menos una factura completa usando la aplicación, con datos reales o de ejemplo, y
mostrar su diseño renderizado correctamente (captura o demostración en vivo).
Datos de ejemplo sugeridos: Emisor "TechStore S.A.", Cliente "Juan Pérez", 3 ítems (Teclado
x2 a $25, Monitor x1 a $180, Mouse x3 a $12). El sistema debe calcular subtotal, impuesto y
total automáticamente.

Requisitos técnicos
Proyecto en React (Vite, CRA o similar).
Uso correcto de componentes funcionales, useState y props.
Cálculos derivados del estado (no hardcodeados).
Código organizado en componentes reutilizables (mínimo: formulario, lista, vista de factura).
Entregables
Repositorio o carpeta comprimida del proyecto (sin node_modules ).
Instrucciones de ejecución en un README .
Evidencia de al menos una factura creada y visualizada.

Rúbrica de Evaluación
Cada criterio se evalúa según el nivel alcanzado. Puntaje total: 100 puntos.
Criterio Excelente (100%) Aceptable (60%) Insuficiente (0-
30%)

Pts

Formulario de
creación

Captura todos los datos, ítems
dinámicos (agregar/eliminar),
estado con useState y validación
funcional.

Captura datos
básicos y crea
facturas, pero faltan
ítems dinámicos o
validación.

Formulario
incompleto o no
guarda datos.

30

Listado de
facturas

Lista todas las facturas con
.map() y key, permite selección y
maneja estado vacío.

Lista facturas pero sin
selección o sin
manejo de estado
vacío.

No muestra el
listado o no se
actualiza.

25

Diseño de la
factura

Componente por props, tabla de
ítems, cálculo de
subtotal/impuesto/total y diseño
profesional con CSS.

Muestra la factura y
algunos cálculos,
pero diseño básico o
totales incompletos.

No renderiza el
diseño o faltan
los cálculos.

25

Ejercicio: factura
con datos

Crea y visualiza correctamente al
menos una factura completa con
cálculos correctos.

Crea una factura pero
con errores menores
en datos o cálculo.

No presenta
evidencia de una
factura funcional.
10

Calidad de código
y estructura

Componentes reutilizables,
código limpio, buen uso de
estado y props.

Funciona pero con
código desordenado
o lógica repetida.

Código confuso,
monolítico o con
errores graves.
10

TOTAL 100



parte 2

Ampliar el sistema de facturación construido en el Quiz Práctico #3 con un panel de administración que permita analizar el
conjunto de facturas mediante métricas y gráficos, y agregar lógica de negocio adicional (detección de anomalías, estados de
vencimiento y una proyección de ingresos) que exige razonamiento analítico más allá del CRUD básico.
Importante: Este trabajo es INDIVIDUAL . Se construye sobre el mismo proyecto del Quiz Práctico #3: no se crea una
aplicación nueva.

Contexto
La empresa ahora quiere que un administrador (un rol distinto al empleado que factura) pueda entrar a una sección exclusiva del
sistema y ver el panorama completo del negocio: cuánto se ha facturado, qué clientes son los más importantes, si hay facturas
atípicas o vencidas, y cómo se proyectan los ingresos a futuro.
Requerimientos funcionales
1. Dashboard administrativo con métricas clave (20 pts)
Total facturado acumulado, número total de facturas y ticket promedio (total facturado ÷ número de facturas).
Ranking del top 3 de clientes según el monto total que han facturado.
Todas las métricas deben recalcularse automáticamente a partir del arreglo de facturas existente (nada hardcodeado).
2. Gráficos de análisis (25 pts)
Al menos 2 gráficos: uno de ingresos por período (barras o líneas) y uno de distribución por cliente o categoría (pastel o barras).
Usa una librería de gráficos para React (por ejemplo recharts ).
Los gráficos deben responder a los datos reales de las facturas capturadas, no a datos de ejemplo fijos dentro del componente.
3. Detección de facturas atípicas (20 pts)
Calcula el promedio y la desviación estándar de los totales de todas las facturas.
Marca visualmente (color o etiqueta) las facturas cuyo total se aleje significativamente del promedio (por ejemplo, más de 1.5
desviaciones estándar).
El dashboard debe indicar cuántas facturas fueron marcadas como atípicas.
4. Estados de factura y alertas (20 pts)
Cada factura debe tener una fecha de vencimiento, además de su fecha de emisión.
El estado (Pagada, Pendiente o Vencida) debe derivarse comparando la fecha de vencimiento con la fecha actual (no elegirse
manualmente, salvo marcar una factura como "Pagada").
El dashboard debe mostrar cuántas facturas hay en cada estado.
5. Proyección simple de ingresos (15 pts)
A partir del historial de facturas, calcula una proyección simple del ingreso esperado para el siguiente período (por ejemplo, con
un promedio móvil de los últimos períodos).
Muestra esa proyección en el dashboard, dejando claro que es una estimación, no un dato real.
Requisitos técnicos

Se integra al mismo proyecto de React del Quiz Práctico #3: componentes adicionales, no un proyecto aparte.
El dashboard vive en una sección o ruta distinta, pensada para un rol de administrador.
Los cálculos de promedio, desviación estándar, ranking y proyección deben hacerse en JavaScript puro a partir del arreglo de
facturas, nunca hardcodeados.
Usa useMemo (u otra forma de cálculo derivado) para que el dashboard se actualice cuando cambian las facturas.
Componentes adicionales reutilizables para las tarjetas de métricas y para cada gráfico.
Reto analítico: dataset de prueba
Para validar tu lógica antes de conectar los gráficos, prueba tu dashboard con este conjunto de facturas:
Dataset sugerido: 8 facturas de "TechStore S.A." a distintos clientes, con totales de $180, $210, $195, $2,450 (atípica a
propósito), $220, $175, $205 y $190. Asigna fechas de vencimiento de modo que al menos 2 queden vencidas, al menos 1
pendiente (sin vencer aún) y el resto pagadas. Tu dashboard debe detectar la factura de $2,450 como atípica y mostrar
correctamente el conteo de los 3 estados.

Entregables
Código del dashboard integrado al mismo repositorio del Quiz Práctico #3.
Captura o demostración en vivo del dashboard con datos reales, resaltando al menos una factura atípica y una vencida.
Breve explicación en el README de cómo se calculó la proyección de ingresos.
