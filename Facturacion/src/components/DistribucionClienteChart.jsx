import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { formatColones } from '../utils/currency'

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
            formatter={(value) => [formatColones(Number(value)), 'Monto']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DistribucionClienteChart
