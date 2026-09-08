import { Icon } from '../../components'

function NotAllowed() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name="alert" size={36} />
      </div>
      <h3>Acceso restringido</h3>
      <p>Tu perfil no tiene permisos para esta sección. Contacta al administrador.</p>
    </div>
  )
}

export default NotAllowed