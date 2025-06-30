import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCurrency } from '@/helper/number'
import { DashboardSaleChannels } from '@/lib/api/queries/dashboard/schema'
import { Cell, Pie, PieChart } from 'recharts'
import { CHART_COLORS, PIE_CHART_RADIUS } from '../constants/constant'

const chartConfig = {
  saleChannelName: {
    label: 'Kênh bán',
    color: '#388D3D',
  },
  // lastPeriod: {
  //   label: "Vé bán cùng kỳ",
  //   color: "#92B6FF",
  // },
} satisfies ChartConfig

export interface OverallRootChartsSaleChannelsProps {
  data?: DashboardSaleChannels[]
}

const OverallRootChartsSaleChannels = (props: OverallRootChartsSaleChannelsProps) => {
  const config = props.data?.reduce((acc, item, index) => {
    acc[item.saleChannelName] = {
      label: item.saleChannelName,
    }
    return acc
  }, {} as Record<string, { label: string }>)

  const colors = props.data?.length
    ? Array.from({ length: Math.ceil(props.data.length / CHART_COLORS.length) }, () => CHART_COLORS)
        .flat()
        .slice(0, props.data.length)
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo kênh bán</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-[300px] w-full">
          <PieChart accessibilityLayer>
            <Pie
              data={props.data}
              dataKey="revenue"
              cx="50%"
              cy="50%"
              outerRadius={PIE_CHART_RADIUS}
              nameKey="saleChannelName"
              innerRadius={PIE_CHART_RADIUS - 25}
              startAngle={90}
              endAngle={450}
            >
              {props.data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>

            <ChartLegend content={<ChartLegendContent groupKey="saleChannelGroup" />} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  dataKey={[
                    {
                      label: 'Doanh thu',
                      key: 'revenue',
                      formatter: (value) => formatCurrency(value, { style: 'currency', currency: 'VND' }),
                    },
                    { label: 'Số lượng vé', key: 'ticketSold' },
                  ]}
                  labelKey="saleChannelName"
                  hideIndicator
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default OverallRootChartsSaleChannels
