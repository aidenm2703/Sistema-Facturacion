import { Icon, BusinessMark } from '../../components'

function HomePage({
  userName,
  businessName,
  business,
  currentUser,
  isAdmin,
  quickActions,
  onGo,
  onLoadTestData,
  formatColones,
}) {
  return (
    <div className="home-content">
      <div className="home-card">
        <div className="home-hero-row">
          <div className="home-hero-text">
            <h2>Buen día, {currentUser.nombre || userName}.</h2>
            <p className="subtitle">
              {businessName || business.name} ·{' '}
              {isAdmin ? 'Perfil de administrador' : 'Perfil de empleado'}
            </p>
          </div>
          <div className="home-business-badge">
            <span className="biz-badge-letter" style={{ background: business.color }}>
              <BusinessMark id={business.id} size={22} color="#fff" />
            </span>
            <span>
              <strong>{business.name}</strong>
              <small>{business.items.length} productos precargados</small>
            </span>
          </div>
        </div>
      </div>

      <div className="home-grid">
        {quickActions.map((q) => (
          <button
            key={q.go}
            type="button"
            className="quick-card"
            onClick={() => onGo(q.go)}
          >
            <span className="quick-icon">
              <Icon name={q.icon} size={26} />
            </span>
            <strong>{q.label}</strong>
            <span>{q.desc}</span>
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="test-data-card">
          <h3>Dataset de prueba (reto analítico)</h3>
          <p>
            Carga las <strong>8 facturas de TechStore S.A.</strong> para validar el panel
            administrativo: detección de la factura atípica de{' '}
            <strong>{formatColones(1274000)}</strong> y el conteo de estados (vencidas,
            pendientes y pagadas).
          </p>
          <button type="button" className="btn btn-primary" onClick={onLoadTestData}>
            Cargar dataset de prueba
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage