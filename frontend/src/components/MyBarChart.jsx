import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated chart config to include both students and teachers
const chartConfig = {
  students: {
    label: "Students",
    color: "#0088FE",  // Blue color for students
  },
  teachers: {
    label: "Teachers",
    color: "#00C49F",  // Green color for teachers
  },
  total: {
    label: "Total",
    color: "#FFBB28",  // Yellow color for total
  }
} 

export function MyBarChart({data}) {
  return (
  <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="teachers" fill="#00C49F" radius={4} name="Teachers" />
            <Bar dataKey="students" fill="#0088FE" radius={4} name="Students" />
            <Bar dataKey="parents" fill="#FFBB28" radius={4} name="Parents"></Bar>
            <Bar dataKey="total" fill="#C70039" radius={4} name="Total" style={{ display: 'none' }} />
          </BarChart>
        </ChartContainer>
  )
}
