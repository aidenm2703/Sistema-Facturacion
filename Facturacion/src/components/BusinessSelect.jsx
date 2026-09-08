import { businessTypes } from '../data/businessTypes'
import Logo from './Logo'
import BusinessMark from './BusinessMark'

function BusinessSelect({ userName, onComplete }) {
  return (
    <div className="onboarding business">
      <div className="onboard-card wide">
        <Logo withWordmark size={54} />
        <h1>
          Hola, <span className="highlight">{userName}</span>.
        </h1>
        <p className="welcome-subtitle">
          Selecciona el tipo de negocio para precargar los productos, precios y datos de
          tu empresa. Todos los precios están en colones (₡).
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
              <span className="biz-badge-letter" style={{ background: biz.color }}>
                <BusinessMark id={biz.id} size={22} color="#fff" />
              </span>
              <span className="business-name">{biz.name}</span>
              <span className="business-desc">{biz.description}</span>
              <span className="business-items">
                {biz.items.length > 0
                  ? `${biz.items.length} productos · IVA ${biz.prefilled.impuesto}%`
                  : 'Personaliza todo manualmente'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BusinessSelect