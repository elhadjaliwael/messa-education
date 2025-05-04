import * as React from "react"
import { Label, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function MyPieChart({ 
  data = [], 
  dataKey = "value", 
  nameKey = "name", 
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"],
  centerLabel = true,
  innerRadius = 60,
  outerRadius = 80
}) {
  // Generate chart config dynamically from data
  const chartConfig = React.useMemo(() => {
    const config = {
      [dataKey]: {
        label: "Value",
      }
    }
    
    // Add each data item to config
    data?.forEach((item, index) => {
      config[item[nameKey]] = {
        label: item[nameKey],
        color: colors[index % colors.length]
      }
    })
    
    return config
  }, [data, dataKey, nameKey, colors])

  // Calculate total for center label
  const total = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr[dataKey], 0) || 0
  }, [data, dataKey])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={2}
            paddingAngle={2}
          >
            {data?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
            {centerLabel && (
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
