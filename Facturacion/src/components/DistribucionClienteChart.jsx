import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['#4f46e5', '#9333ea', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04']

function DistribucionClienteChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="chart">
        <h4>Distribución por cliente</h4>
        <p className="chart-empty">Sin datos</p>
      </div>
    )
  }
  return (
    <div className="chart">
      <h4>Distribución por cliente</h4>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="monto"
            nameKey="cliente"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            label={(entry) => entry.cliente}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => ['$' + Number(value).toLocaleString('es-ES'), 'Monto']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DistribucionClienteChart
