import { Button } from '@/components/ui/button'
import { Dashboard } from '@/lib/api/queries/dashboard/schema'
import { cn } from '@/lib/tw'
import { DASHBOARD_TYPE_OPTIONS } from '../constants/constant'
import { useQueryType } from '../hooks/use-query'
import OverallRootChartsTotalAmount from './overall-root-charts-total-amount'

export interface OverallRootChartsProps {
  data?: {
    revenue: Dashboard['revenue']
    ticketSold: Dashboard['ticketSold']
    saleChannels: Dashboard['saleChannels']
    composedChart: Dashboard['composedChart']
    pieChart: Dashboard['pieChart']
  }
}

const OverallRootCharts = (props: OverallRootChartsProps) => {
  const [type, setType] = useQueryType()

  return (
    <section className="flex flex-col gap-2">
      <div className="self-start flex gap-1 bg-neutral-white p-1 rounded-lg">
        {DASHBOARD_TYPE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-md bg-neutral-white text-neutral-grey-300 text-sm hover:bg-neutral-grey-50',
              type === opt.value && 'bg-neutral-grey-50 text-neutral-black',
            )}
            onClick={() => setType(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* <OverallRootChartsSaleChannels data={props.data?.pieChart} /> */}

      <OverallRootChartsTotalAmount composedChart={props.data?.composedChart} pieChart={props.data?.pieChart} />

      {/* <OverallRootChartsSoldTickets data={props.data?.ticketSold} /> */}
    </section>
  )
}

export default OverallRootCharts
