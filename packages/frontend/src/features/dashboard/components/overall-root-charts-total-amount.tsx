import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatCurrency } from '@/helper/number'
import { DashboardComposedChart, DashboardPieChart } from '@/lib/api/queries/dashboard/schema'
import { cn } from '@/lib/tw'
import { toVietnameseNumber } from '@/utils/currency'
import { appDayJs } from '@/utils/dayjs'
import groupBy from 'lodash/groupBy'
import { Fragment } from 'react'
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Label, Pie, PieChart, XAxis, YAxis } from 'recharts'
import { CHART_COLORS, PIE_CHART_RADIUS } from '../constants/constant'
import { useQueryDateRange } from '../hooks/use-query'

// const chartConfig = {
//   current: {
//     label: 'Doanh thu',
//     color: '#388D3D',
//   },
//   // lastPeriod: {
//   //   label: "Doanh thu cùng kỳ",
//   //   color: "#92B6FF",
//   // },
// } satisfies ChartConfig

// const fields = Object.keys(chartConfig)

export interface OverallRootChartsTotalAmountProps {
  composedChart?: DashboardComposedChart[]
  pieChart?: DashboardPieChart[]
}

const getPath = (x: number, y: number, width: number, height: number) => {
  const radius = 4

  return `M${x + radius},${y}
    L${x + width - radius},${y}
    A${radius},${radius} 0 0 1 ${x + width},${y + radius}
    L${x + width},${y + height}
    L${x},${y + height}
    L${x},${y + radius}
    A${radius},${radius} 0 0 1 ${x + radius},${y}
    Z`
}

interface RoundedTopBarProps {
  fill?: string
  x?: number
  y?: number
  width?: number
  height?: number
}

interface ConfigItem {
  label: string
  color: string
  group: string
  groupIcon?: React.ReactNode
}
interface Config {
  [key: string]: ConfigItem
}

const RoundedTopBar = (props: any) => {
  const { fill, x, y, width, height } = props

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />
}

const OverallRootChartsTotalAmount = (props: OverallRootChartsTotalAmountProps) => {
  const [range] = useQueryDateRange()
  const colors = props.pieChart?.length
    ? Array.from({ length: Math.ceil(props.pieChart.length / CHART_COLORS.length) }, () => CHART_COLORS)
        .flat()
        .slice(0, props.pieChart.length)
    : []

  const saleChannelConfig = props.pieChart?.reduce((acc, item, index) => {
    acc[item.saleChannelName] = {
      label: item.saleChannelName,
      color: colors[index % colors.length],
      group: item.saleChannelGroup,
    }
    return acc
  }, {} as Config)

  const ChartLineLegend = <ChartLineIcon color="#388D3D" />

  const areaConfig: Config = {
    currentTicketSold: {
      label: 'Số lượng vé',
      color: '#388D3D',
      group: 'ticketSold',
      groupIcon: ChartLineLegend,
    },
  }

  const config = {
    ...saleChannelConfig,
    ...areaConfig,
  } as Config

  const groupByData = groupBy(Object.values(config), (value) => value?.group)
  const groupByDataEntries = Object.entries(groupByData)

  const pieChartTotal = props.pieChart?.reduce(
    (acc, item) => ({
      ...acc,
      revenue: acc.revenue + item.revenue,
      ticketSold: acc.ticketSold + item.ticketSold,
    }),
    {
      revenue: 0,
      ticketSold: 0,
    },
  )

  const pieChartData = props.pieChart?.map((item) => ({
    ...item,
    revenuePercentage: Number(((item.revenue / (pieChartTotal?.revenue || 0)) * 100).toFixed(2)),
    ticketSoldPercentage: Number(((item.ticketSold / (pieChartTotal?.ticketSold || 0)) * 100).toFixed(2)),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>Tổng doanh thu</div>
          <div className="text-sm font-normal">
            {range.from && appDayJs(range.from).isValid() && appDayJs(range.from).format('DD/MM/YYYY')}
            {range.to && appDayJs(range.to).isValid() && appDayJs(range.to).format(' - DD/MM/YYYY')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="grid grid-cols-2 xl:flex">
          <ChartContainer config={config} className="max-h-[300px] w-full col-span-2 xl:flex-[4_1_0%]">
            <ComposedChart accessibilityLayer data={props.composedChart}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => toVietnameseNumber(value)}
                yAxisId="left"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => (value < 0 ? '' : toVietnameseNumber(value))}
                // domain={([dataMin, dataMax]) => {
                //   const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax))
                //   return [-absMax / 2, absMax]
                // }}
              />
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    tooltipLabel="Tổng doanh thu"
                    indicator="dot"
                    tooltipType="full"
                    numberValueOptions={{ style: 'currency', currency: 'VND' }}
                    tooltipPrefix={({ payload, label }) => {
                      const currentRevenue = (payload?.[0] as any)?.payload?.currentRevenue
                      const currentTicketSold = (payload?.[0] as any)?.payload?.currentTicketSold
                      return (
                        <div className="flex flex-col justify-between">
                          {currentRevenue || currentTicketSold ? (
                            <>
                              <div>
                                <div className="text-base font-bold">
                                  {formatCurrency(currentRevenue, {
                                    style: 'currency',
                                    currency: 'VND',
                                  })}
                                </div>
                                <div className="text-wrap">{label}</div>
                              </div>
                              <div className="flex gap-2">
                                {ChartLineLegend}
                                <div>
                                  <div>Số lượng vé</div>
                                  <div>{currentTicketSold}</div>
                                </div>
                              </div>
                            </>
                          ) : (
                            'Không có dữ liệu'
                          )}
                        </div>
                      )
                    }}
                    hiddenKey={['currentTicketSold']}
                  />
                }
              />
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
              {saleChannelConfig &&
                Object.keys(saleChannelConfig).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={saleChannelConfig[key].color}
                    barSize={24}
                    yAxisId="left"
                    stackId="date"
                    // shape={<RoundedTopBar />}
                  />
                ))}

              <Area
                dataKey="currentTicketSold"
                yAxisId="right"
                fill="url(#fillcurrent)"
                fillOpacity={0}
                stroke="#388D3D"
                strokeWidth={2}
                type="monotone"
              />
            </ComposedChart>
          </ChartContainer>
          <ChartContainer config={config} className="max-h-[300px] w-full xl:flex-1">
            <PieChart accessibilityLayer>
              <Pie
                data={pieChartData}
                dataKey="revenue"
                cx="50%"
                cy="50%"
                outerRadius={`${PIE_CHART_RADIUS}%`}
                nameKey="saleChannelName"
                innerRadius={`${PIE_CHART_RADIUS - 25}%`}
                startAngle={90}
                endAngle={-270}
              >
                {pieChartData?.map((entry, index) => (
                  <Cell key={`revenue-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
                <Label value="Doanh thu" position="center" className="text-sm font-semibold text-black" />
              </Pie>

              {/* <ChartLegend content={<ChartLegendContent groupKey="saleChannelGroup" />} /> */}
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
                      {
                        label: 'Tỷ lệ',
                        key: 'revenuePercentage',
                        formatter: (value) => `${value}%`,
                      },
                    ]}
                    labelKey="saleChannelName"
                    hideIndicator
                  />
                }
              />
            </PieChart>
          </ChartContainer>
          <ChartContainer config={config} className="max-h-[300px] w-full xl:flex-1">
            <PieChart accessibilityLayer>
              <Pie
                data={pieChartData}
                dataKey="ticketSold"
                cx="50%"
                cy="50%"
                outerRadius={`${PIE_CHART_RADIUS}%`}
                nameKey="saleChannelName"
                innerRadius={`${PIE_CHART_RADIUS - 25}%`}
                startAngle={90}
                endAngle={-270}
              >
                {pieChartData?.map((entry, index) => (
                  <Cell key={`ticketSold-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
                <Label value="Vé bán" position="center" className="text-sm font-semibold text-black" />
              </Pie>

              {/* <ChartLegend content={<ChartLegendContent groupKey="saleChannelGroup" />} /> */}
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    dataKey={[
                      { label: 'Số lượng vé', key: 'ticketSold' },
                      { label: 'Tỷ lệ', key: 'ticketSoldPercentage', formatter: (value) => `${value}%` },
                    ]}
                    labelKey="saleChannelName"
                    hideIndicator
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="text-xs font-medium">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {groupByDataEntries.map(([groupByKey, payload], index) => {
              const groupIcon = payload?.find((item) => item.groupIcon)?.groupIcon
              return (
                <Fragment key={groupByKey}>
                  <div className="flex flex-col h-full justify-center items-center">
                    <div className="text-neutral-grey-400 text-xs font-medium normal-case text-center h-4">
                      {groupIcon || groupByKey}
                    </div>
                    <div className="flex gap-4">
                      {Object.values(payload).map((item) => {
                        const key = `${item.label || item.group || 'value'}`

                        return (
                          <div
                            key={key}
                            className={cn(
                              'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-neutral-grey-400',
                            )}
                          >
                            {!groupIcon && (
                              <div
                                className="h-3 w-3 shrink-0 rounded-sm"
                                style={{
                                  backgroundColor: item.color,
                                }}
                              />
                            )}
                            {key}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {index < groupByDataEntries.length - 1 && <div className="self-stretch w-px bg-neutral-grey-200" />}
                </Fragment>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ChartLineIcon = ({ color }: { color?: string }) => {
  return (
    <div className="flex items-center">
      <div className="w-4 h-0.5 bg-green-500" style={{ backgroundColor: color }}></div>
      <div className="w-2 h-2 border border-green-500 rounded-full" style={{ borderColor: color }}></div>
      <div className="w-4 h-0.5 bg-green-500" style={{ backgroundColor: color }}></div>
    </div>
  )
}

export default OverallRootChartsTotalAmount
