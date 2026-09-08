import { Logo } from '../../components'
import { Icon } from '../../components'

const VALUES = [
  {
    icon: 'check',
    title: 'Confianza',
    text: 'Facturas claras, totales verificables y estados derivados automáticamente. Tu negocio siempre en orden.',
  },
  {
    icon: 'inventario',
    title: 'Control',
    text: 'Inventario en ₡ con existencias, descuento automático de stock y permisos por empleado.',
  },
  {
    icon: 'reservas',
    title: 'Atención',
    text: 'Reservas para varias personas, calendario conectado y avisos simulados por llamada.',
  },
  {
    icon: 'panel',
    title: 'Decisiones',
    text: 'Métricas, gráficos y detección de facturas atípicas para decidir con datos.',
  },
]

function AboutScreen({ businessName, userName, currentUser }) {
  return (
    <div className="about-screen">
      <div className="about-hero">
        <Logo size={64} />
        <div>
          <h2>¿Quiénes somos?</h2>
          <p>
            <strong>Aiden&apos;s System</strong> es una solución de facturación,
            cobros, reservas e inventario diseñada para pequeños y medianos negocios
            de Costa Rica. Nuestro objetivo es que administrar tu empresa sea claro,
            ordenado y profesional.
          </p>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>Nuestra misión</h3>
          <p>
            Brindar a cada negocio una herramienta sencilla para facturar en colones
            (₡), controlar sus productos, cobrar a tiempo y atender a sus clientes
            sin complicaciones técnicas.
          </p>
        </div>
        <div className="about-card">
          <h3>Nuestra visión</h3>
          <p>
            Ser el sistema de facturación de confianza del comercio costarricense:
            formal, accesible y siempre listo para crecer con tu negocio.
          </p>
        </div>
      </div>

      <h3 className="about-values-title">Qué nos caracteriza</h3>
      <div className="values-grid">
        {VALUES.map((v) => (
          <div key={v.title} className="value-card">
            <span className="value-icon">
              <Icon name={v.icon} size={20} />
            </span>
            <strong>{v.title}</strong>
            <p>{v.text}</p>
          </div>
        ))}
      </div>

      <div className="about-foot">
        <Icon name="usuarios" size={18} />
        <p>
          Gracias por confiar en nosotros, {userName || currentUser?.nombre}. Atendemos
          este sistema desde {businessName || 'tu negocio'} y para cualquier consulta
          visita la sección <strong>Ayuda</strong>.
        </p>
      </div>
    </div>
  )
}

export default AboutScreen