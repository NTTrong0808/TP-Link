'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'

import { formatCurrency } from '@/helper'
import { cn } from '@/lib/tw'
import groupBy from 'lodash/groupBy'
import WaveSineIcon from '../widgets/icons/wave-sine-icon'
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {
  light: '',
  // dark: ".dark"
} as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config?: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config: config || {} }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-grey-200 [&_.recharts-surface]:outline-none',
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-grey-200",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-grey-200",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none",
          "[&_.recharts-cartesian-axis-tick_text]:fill-neutral-grey-400 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-grey-200/50",
          '[&_.recharts-radial-bar-background-sector]:fill-neutral-grey-50 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-grey-50',
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config || {}} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'Chart'

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: 'line' | 'dot' | 'dashed' | 'wave'
      nameKey?: string
      labelKey?: string
      dataKey?: string | { label: string; key: string; formatter?: (value: number) => string }[]
      numberValueOptions?: Intl.NumberFormatOptions
      tooltipLabel?: React.ReactNode
      tooltipType?: 'normal' | 'full'
      tooltipPrefix?: (props: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => React.ReactNode
      hiddenKey?: string[] | string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      dataKey,
      numberValueOptions,
      tooltipType = 'normal',
      tooltipPrefix,
      hiddenKey,
      ...props
    },
    ref,
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      if (props.tooltipLabel) {
        return props.tooltipLabel
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || 'value'}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
      }

      if (!value) {
        return null
      }

      return <div className={cn('font-medium', labelClassName)}>{value}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

    if (!active || !payload?.length) {
      return null
    }

    // const nestLabel = payload.length === 0 && indicator !== 'dot'

    const currentItem = payload.find((item) => item.dataKey === dataKey)

    const payloadWithoutHiddenKey = payload.filter((item) => !hiddenKey?.includes(item.dataKey as string))

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[200px] items-start rounded-lg border border-neutral-grey-200 text-sm font-medium',
          'bg-neutral-white  text-xs shadow-xl',
          className,
        )}
      >
        {tooltipLabel && <div className="px-4 py-2 bg-neutral-grey-100 rounded-t-lg">{tooltipLabel}</div>}
        <div className={cn('p-4', tooltipType === 'full' && 'flex gap-6')}>
          {tooltipType === 'full' && tooltipPrefix && tooltipPrefix({ payload, label })}
          <div
            className={cn(
              'grid gap-3 rounded-b-lg',
              tooltipType === 'full' && payloadWithoutHiddenKey.length > 2 && 'grid-cols-2',
            )}
          >
            {payloadWithoutHiddenKey.map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || 'value'}`
              const itemConfig = getPayloadConfigFromPayload(config, item, key)
              const indicatorColor = color || item.payload.fill || item.color

              const icon = itemConfig?.icon ? (
                <itemConfig.icon />
              ) : (
                !hideIndicator &&
                (indicator === 'wave' ? (
                  <div
                    className={cn('shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]')}
                    style={
                      {
                        '--color-border': indicatorColor,
                      } as React.CSSProperties
                    }
                  >
                    <WaveSineIcon
                      className={cn('h-4 w-4')}
                      style={{
                        color: itemConfig?.color || indicatorColor,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className={cn('shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]', {
                      'h-2.5 w-2.5': indicator === 'dot',
                      'w-1': indicator === 'line',
                      'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                      // 'my-0.5': nestLabel && indicator === 'dashed',
                    })}
                    style={
                      {
                        '--color-bg': itemConfig?.color || indicatorColor,
                        '--color-border': indicatorColor,
                      } as React.CSSProperties
                    }
                  />
                ))
              )

              return (
                <div
                  key={item.dataKey}
                  className={cn(
                    'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-neutral-grey-300',
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : Array.isArray(dataKey) ? (
                    <div className={cn('flex gap-2 flex-col w-full')}>
                      {icon}
                      {dataKey.map((key) => (
                        <div
                          className={cn(
                            'flex flex-1 justify-between leading-none gap-1',
                            // nestLabel ? 'items-end' :
                            'items-center',
                          )}
                          key={key.key}
                        >
                          <div className="grid gap-1.5 text-neutral-grey-400">
                            {/* {nestLabel ? tooltipLabel : null} */}
                            <div className="text-neutral-grey-300">{key.label}</div>
                          </div>
                          {item?.payload?.payload?.[key.key] && (
                            <div className="font-mono font-medium tabular-nums text-foreground flex-1 text-right">
                              {key.formatter
                                ? key.formatter(item?.payload?.payload?.[key.key] as number)
                                : Number(item?.payload?.payload?.[key.key])
                                ? formatCurrency(item?.payload?.payload?.[key.key] as number, numberValueOptions)
                                : item?.payload?.payload?.[key.key]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none gap-1',
                        // nestLabel ? 'items-end' :
                        tooltipType === 'full' ? 'flex-col' : 'items-center',
                      )}
                    >
                      <div className="flex gap-1 items-center">
                        {icon}
                        <div className="grid gap-1.5 text-neutral-grey-400">
                          {/* {nestLabel ? tooltipLabel : null} */}
                          <div className="text-neutral-grey-300">{itemConfig?.label || item.name}</div>
                        </div>
                      </div>
                      {item.payload && (
                        <div className="font-mono font-medium tabular-nums text-foreground flex-1">
                          {Number(item.value) ? formatCurrency(item.value as number, numberValueOptions) : item.value}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {currentItem?.payload.rate > 0 && (
              <div className="text-[#A7A7A7] text-xs font-normal">
                {Number(currentItem?.payload.rate) > 0 ? 'Tăng' : 'Giảm'}{' '}
                {formatCurrency(Math.abs(currentItem?.payload.rate), {
                  style: 'percent',
                })}{' '}
                so với {currentItem?.payload.lastPeriodDate}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = 'ChartTooltip'

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
      hideIcon?: boolean
      nameKey?: string
      groupKey?: string
    }
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey, groupKey }, ref) => {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  if (groupKey) {
    const groupByData = groupBy(payload, (data) => data?.payload?.[groupKey as keyof typeof data.payload])
    const groupByDataEntries = Object.entries(groupByData)
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}
      >
        {groupByDataEntries.map(([groupByKey, payload], index) => {
          return (
            <React.Fragment key={groupByKey}>
              <div className="flex flex-col h-full">
                <div className="text-neutral-grey-400 text-xs font-medium normal-case text-center h-4">
                  {groupByKey}
                </div>
                <div className="flex gap-4">
                  {payload.map((item) => {
                    const key = `${nameKey || item.dataKey || 'value'}`
                    const itemConfig = getPayloadConfigFromPayload(config, item, key)

                    return (
                      <div
                        key={item.value}
                        className={cn(
                          'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-neutral-grey-400',
                        )}
                      >
                        {itemConfig?.icon && !hideIcon ? (
                          <itemConfig.icon />
                        ) : (
                          <div
                            className="h-3 w-3 shrink-0 rounded-sm"
                            style={{
                              backgroundColor: itemConfig?.color || item.color,
                            }}
                          />
                        )}
                        {itemConfig?.label}
                      </div>
                    )
                  })}
                </div>
              </div>
              {index < groupByDataEntries.length - 1 && <div className="self-stretch w-px bg-neutral-grey-200" />}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn('flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-neutral-grey-400')}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{
                  backgroundColor: itemConfig?.color || item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = 'ChartLegend'

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent }
