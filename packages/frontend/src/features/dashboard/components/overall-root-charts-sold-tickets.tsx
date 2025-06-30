import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { DashboardChart } from '@/lib/api/queries/dashboard/schema'
import { toVietnameseNumber } from '@/utils/currency'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const chartConfig = {
  current: {
    label: 'Vé bán',
    color: '#388D3D',
  },
  // lastPeriod: {
  //   label: "Vé bán cùng kỳ",
  //   color: "#92B6FF",
  // },
} satisfies ChartConfig

const fields = Object.keys(chartConfig)

export interface OverallRootChartsSoldTicketsProps {
  data?: DashboardChart[]
}

const OverallRootChartsSoldTickets = (props: OverallRootChartsSoldTicketsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng vé đã bán</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <AreaChart data={props.data} accessibilityLayer>
            <defs>
              <linearGradient id="filllastPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-lastPeriod)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-lastPeriod)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-current)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-current)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => toVietnameseNumber(value)}
            />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent indicator="wave" dataKey="current" />} />
            {fields.map((field) => (
              <Area key={field} dataKey={field} fill="url(#fillcurrent)" radius={8} stackId="a" type="linear" />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default OverallRootChartsSoldTickets
