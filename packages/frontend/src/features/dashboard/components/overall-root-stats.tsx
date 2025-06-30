import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import ToteIcon from '@/components/widgets/icons/tote-icon'
import SolidLine from '@/components/widgets/solid-line'
import { formatCurrency } from '@/helper'
import { Dashboard } from '@/lib/api/queries/dashboard/schema'
import { cn } from '@/lib/tw'
import { InfoIcon, Ticket, Wallet } from 'lucide-react'
import { ComponentType, ReactNode, useMemo } from 'react'

export interface OverallStatBlock {
  id: string
  icon: ComponentType
  label: string
  profitValueKey: string
  profitRateKey?: string
  suffix?: string
  tooltip?: ReactNode
  items?: {
    label: string
    key: string
    suffix?: string
    color?: string
  }[]
}

export interface OverallRootStatsProps {
  data?: Partial<Dashboard>
}

const COLORS = { blue: '#2970FF', green: '#12B76A', orange: '#F79009' }

const statBlocks: OverallStatBlock[] = [
  {
    id: 'total-amount',
    icon: Wallet,
    label: 'Tổng doanh thu',
    profitValueKey: 'totalRevenue',
    profitRateKey: 'totalRevenueRate',
    suffix: 'đ',
    items: [
      {
        label: 'Tiền mặt',
        key: 'totalRevenueByCash',
        suffix: 'đ',
        color: COLORS.green,
      },
      // {
      //   label: 'Payoo QR',
      //   key: 'totalRevenueByPayooQR',
      //   suffix: 'đ',
      //   color: COLORS.blue,
      // },
      {
        label: 'Khác',
        key: 'totalRevenueByPayoo',
        suffix: 'đ',
        color: COLORS.blue,
      },
    ],
    tooltip: `Tổng doanh thu`,
  },
  {
    id: 'total-sold',
    icon: Ticket,
    label: 'Vé bán',
    profitValueKey: 'totalTicketSold',
    profitRateKey: 'totalTicketSoldRate',
    suffix: 'vé',
    items: [
      {
        label: 'Người lớn',
        key: 'totalTicketSoldAdult',
        color: COLORS.green,
        suffix: 'vé',
      },
      {
        label: 'Trẻ em',
        key: 'totalTicketSoldChild',
        color: COLORS.blue,
        suffix: 'vé',
      },
    ],
    tooltip: `Vé bán`,
  },
  {
    id: 'total-booking',
    icon: ToteIcon,
    label: 'Tổng đơn hàng',
    profitValueKey: 'totalBooking',
    profitRateKey: 'totalBookingRate',
    suffix: 'đơn hàng',
    items: [
      {
        label: 'Trung bình',
        key: 'totalBookingAverage',
        suffix: 'đ / đơn',
        color: COLORS.blue,
      },
    ],
    tooltip: `Đơn hàng`,
  },
]

const OverallRootStats = ({ data }: OverallRootStatsProps) => {
  const statsValueByKeys = useMemo<Record<string, any>>(() => {
    return {
      totalRevenue: data?.totalRevenue || 0,
      totalRevenueByCash: data?.totalRevenueByCash || 0,
      totalRevenueByPayoo: data?.totalRevenueByPayoo || 0,
      // totalRevenueByPayooQR: data?.totalRevenueByPayooQR || 0,

      totalTicketSold: data?.totalTicketSold || 0,
      totalTicketSoldAdult: data?.totalTicketSoldAdult || 0,
      totalTicketSoldChild: data?.totalTicketSoldChild || 0,

      totalBooking: data?.totalBooking || 0,
      totalBookingAverage: data?.totalBookingAverage || 0,
    }
  }, [data])

  return (
    <div className="flex flex-wrap gap-4 w-full">
      {statBlocks.map((block) => {
        const Icon = block.icon as ComponentType<any>
        return (
          <section
            key={block.id}
            className="p-4 flex flex-col gap-4 basis-40 flex-1 border border-low rounded-lg bg-neutral-white"
          >
            <header className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Icon className="size-5 text-neutral-grey-300" />
                  <p className="text-sm font-medium text-neutral-grey-400">{block.label}</p>
                </div>

                {block.tooltip ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="size-4 text-neutral-grey-300" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-72 text-pretty text-center" shadowArrow>
                      {block.tooltip}
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>

              <div className="text-xl text-neutral-grey-600 font-bold">
                {statsValueByKeys?.[block.profitValueKey]
                  ? formatCurrency(statsValueByKeys?.[block.profitValueKey])
                  : '---'}{' '}
                {block.suffix && <span className="text-base font-normal text-neutral-grey-400">{block.suffix}</span>}
              </div>
            </header>
            <SolidLine className="border-low" />
            <main className="flex items-center gap-4">
              {block.items?.map((item) => (
                <StatItem {...item} key={item.key} value={statsValueByKeys?.[item.key]} />
              ))}
              {/* {block.profitRateKey ? (
                <p
                  className={`${
                    statsValueByKeys?.[block.profitRateKey] >= 0
                      ? 'text-semantic-success-300'
                      : 'text-semantic-danger-300'
                  } flex items-center gap-1`}
                >
                  {statsValueByKeys?.[block.profitRateKey] >= 0 ? (
                    <TrendUpIcon className="size-4" />
                  ) : (
                    <TrendUpIcon className="size-4 rotate-180" />
                  )}
                  {statsValueByKeys?.[block.profitRateKey] && !isNaN(statsValueByKeys?.[block.profitRateKey])
                    ? formatCurrency(Math.abs(statsValueByKeys?.[block.profitRateKey]), {
                        style: 'percent',
                      })
                    : '---'}
                </p>
              ) : null} */}
            </main>
          </section>
        )
      })}
    </div>
  )
}

const StatItem = ({
  label,
  value,
  suffix,
  className,
  color,
}: {
  label: string
  value: number
  suffix?: string
  className?: string
  color?: string
}) => {
  if (!value) return null
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-sm font-medium text-neutral-grey-400">{label}</div>
      <div
        className={cn('text-base font-semibold px-3 py-1 bg-neutral-grey-50 rounded-r-md border-l-2 text-nowrap')}
        style={{ borderColor: color }}
      >
        {formatCurrency(value)} <span className="text-xs font-normal text-neutral-grey-400">{suffix}</span>
      </div>
    </div>
  )
}

export default OverallRootStats
