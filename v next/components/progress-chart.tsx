"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", progression: 20 },
  { name: "Fév", progression: 35 },
  { name: "Mar", progression: 45 },
  { name: "Avr", progression: 60 },
  { name: "Mai", progression: 75 },
  { name: "Juin", progression: 85 },
  { name: "Juil", progression: 90 },
]

export function ProgressionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="progression" stroke="#3b82f6" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
