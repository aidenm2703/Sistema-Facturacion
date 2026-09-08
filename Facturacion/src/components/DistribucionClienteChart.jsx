import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { formatColones } from '../utils'

const COLORS = ['#1b2b4f', '#c9a227', '#2c3e6b', '#8a6d1d', '#16233f', '#3b4f8f', '#a5822a']

function DistribucionClienteChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="chart">
        <h4>Distribución por cliente</h4>
        <p className="chart-empty">Sin datos</p>
      </div>
    )
  }
  const ordenado = [...data].sort((a, b) => b.monto - a.monto)
  const total = ordenado.reduce((acc, d) => acc + Number(d.monto), 0)
  return (
    <div className="chart">
      <h4>Distribución por cliente</h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={ordenado}
            dataKey="monto"
            nameKey="cliente"
            innerRadius={55}
            outerRadius={88}
            paddingAngle={3}
            stroke="#fff"
            strokeWidth={2}
          >
            {ordenado.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              formatColones(Number(value)) + ` (${((Number(value) / total) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend
            formatter={(value) =>
              value.length > 22 ? value.slice(0, 20) + '…' : value
            }
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DistribucionClienteChart
