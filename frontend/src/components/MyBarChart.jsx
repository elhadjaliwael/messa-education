import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Update the chart config to match the data structure
const chartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--chart-1))",
  },
} 

export function MyBarChart({data}) {
  // Remove console.log in production
  return (
    <ChartContainer config={chartConfig}>
    <BarChart accessibilityLayer data={data}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="name"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
      />
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent hideLabel />}
      />
      <Bar dataKey="students" fill="var(--color-desktop)" radius={8} />
    </BarChart>
  </ChartContainer>
  )
}
