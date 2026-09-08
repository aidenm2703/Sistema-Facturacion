import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { formatColones } from '../utils/currency'

function IngresosPeriodoChart({ data }) {
  return (
    <div className="chart">
      <h4>Ingresos por período</h4>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf3" />
          <XAxis dataKey="periodo" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={(v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)} />
          <Tooltip
            formatter={(value) => [formatColones(Number(value)), 'Ingresos']}
          />
          <Bar dataKey="ingresos" fill="#1b2b4f" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default IngresosPeriodoChart
