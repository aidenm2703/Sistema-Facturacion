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
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf3" />
          <XAxis
            dataKey="periodo"
            fontSize={11}
            angle={-38}
            textAnchor="end"
            interval="preserveStartEnd"
            minTickGap={6}
            tickMargin={6}
          />
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
