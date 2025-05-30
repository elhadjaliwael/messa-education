"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  progress: {
    label: "Progress",
    color: "#8b5cf6", // fallback purple color
  },
};

export function LineChartComponent({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return <div className="text-muted text-sm">No data available</div>;
  }

  const xKey =
    Object.keys(chartData[0]).find((k) =>
      ["name", "month", "date"].includes(k)
    ) || Object.keys(chartData[0])[0];

  const sortedChartData = [...chartData].sort((a, b) =>
    a[xKey] > b[xKey] ? 1 : -1
  );

  return (
    <ChartContainer config={chartConfig}>
      <LineChart data={sortedChartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) =>
            typeof value === "string" ? value.slice(5) : value
          }
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          type="linear"
          dataKey="progress"
          stroke={chartConfig.progress.color}
          strokeWidth={2}
          dot={{ fill: chartConfig.progress.color }}
          activeDot={{ r: 6 }}
          name={chartConfig.progress.label}
          isAnimationActive={true}
          connectNulls={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
