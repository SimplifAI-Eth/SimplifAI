"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Price",
    color: "#192bc2",
  },
} satisfies ChartConfig

export function Component({ chartData }: { chartData: { time: number; value: number }[] }) {
  const minValue = Math.min(...chartData.map(data => data.value));
  const processedData = chartData.map(data => ({
    ...data,
    time: new Date(data.time * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "numeric" })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Price Information</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
            }}
            >
            <CartesianGrid vertical={false} />
            <YAxis domain={[minValue, 'auto']} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value, name, props) => {
              const { payload } = props;
              return [`$${Math.round(Number(value) * 10000) / 10000}`, ` Time: ${payload.time}`];
              }}
            />
            <Line
              dataKey="value"
              type="linear"
              stroke="#192bc2"
              strokeWidth={2}
              dot={false}
            />
            </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
