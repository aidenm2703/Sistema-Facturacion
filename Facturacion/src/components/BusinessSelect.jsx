import { businessTypes } from '../data/businessTypes'

function BusinessSelect({ userName, onComplete }) {
  return (
    <div className="onboarding business">
      <h1>
        ¡Bienvenido, <span className="highlight">{userName}</span>! 👋
      </h1>
      <p className="welcome-subtitle">
        Elige tu tipo de negocio y cargaremos automáticamente productos, precios y
        datos de tu empresa para que empieces en segundos.
      </p>

      <div className="business-grid">
        {businessTypes.map((biz) => (
          <button
            key={biz.id}
            type="button"
            className="business-card"
            style={{ '--card-color': biz.color }}
            onClick={() => onComplete(biz)}
          >
            <span className="business-icon">{biz.icon}</span>
            <span className="business-name">{biz.name}</span>
            <span className="business-desc">{biz.description}</span>
            <span className="business-items">
              {biz.items.length > 0
                ? `${biz.items.length} productos precargados`
                : 'Personaliza todo manualmente'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BusinessSelect
