import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { formatColones } from '../utils'

function VentasPorDiaChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="chart">
        <h4>Ventas por día</h4>
        <p className="chart-empty">Sin datos</p>
      </div>
    )
  }
  return (
    <div className="chart">
      <h4>Ventas por día</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 42 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf3" />
          <XAxis
            dataKey="dia"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            interval="preserveStartEnd"
            minTickGap={8}
            tickMargin={8}
          />
          <YAxis
            fontSize={12}
            tickFormatter={(v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)}
          />
          <Tooltip
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.fecha || label
            }
            formatter={(value) => [formatColones(Number(value)), 'Ingresos']}
          />
          <Bar dataKey="ingresos" fill="#c9a227" radius={[5, 5, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VentasPorDiaChart