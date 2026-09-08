function MetricCard({ label, value, icon, color, sub }) {
  return (
    <div className="metric-card" style={{ '--mc-color': color || '#4f46e5' }}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-body">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
        {sub && <span className="metric-sub">{sub}</span>}
      </div>
    </div>
  )
}

export default MetricCard
