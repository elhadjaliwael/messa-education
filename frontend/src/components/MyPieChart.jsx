import * as React from "react"
import { Label, Pie, PieChart,Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Students",
  },
  "École Primaire": {
    label: "École Primaire",
    color: "#0088FE",  // Bright blue
  },
  "Collège": {
    label: "Collège",
    color: "#00C49F",  // Teal
  },
  "Lycée": {
    label: "Lycée",
    color: "#FFBB28",  // Yellow/gold
  }
}

export function MyPieChart({data}) {
  const total = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.value, 0) || 0
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Student Distribution</CardTitle>
        <CardDescription>By Education Level</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}
              paddingAngle={2}
              fill="#8884d8"
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartConfig[entry.name]?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                />
              ))}
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
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="grid grid-cols-3 w-full gap-2">
          {data?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: chartConfig[item.name]?.color || `hsl(var(--chart-${index + 1}))` }}
              />
              <span className="text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
