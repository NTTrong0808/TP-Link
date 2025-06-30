'use client'

import CaretLeftIcon from '@/components/widgets/icons/caret-left-icon'
import CaretRightIcon from '@/components/widgets/icons/caret-right-icon'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import TicketIcon from '@/components/widgets/icons/ticket-icon'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { usePriceConfigContext } from './price-config-context'
import PriceConfigDistribution from './price-config-distribution'
import PriceRepeatConfigDistribution from './price-repeat-config-distribution'

const PriceConfigHeader = ({ className }: { className?: string }) => {
  const isCanAccess = useCanAccess()
  const { currentDate, nextMonth, previousMonth, selectedPriceConfigs } = usePriceConfigContext()
  const canConfigServicePriceByDate = isCanAccess(CASL_ACCESS_KEY.TICKET_CONFIG_SERVICE_PRICE_BY_DATE)
  return (
    <section className={cn('flex items-center gap-3 px-4 py-3 bg-white rounded-t-lg', className)}>
      <div className="flex items-center gap-3">
        <button
          className="flex size-7 items-center justify-center rounded-full border border-neutral-grey-100"
          onClick={previousMonth}
          type="button"
        >
          <CaretLeftIcon />
        </button>
        <p className="font-medium text-neutral-grey-600">Tháng {currentDate.format('MM YYYY')}</p>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full border border-neutral-grey-100"
          onClick={nextMonth}
        >
          <CaretRightIcon />
        </button>
      </div>

      <div className="ml-auto flex items-center gap-6">
        {canConfigServicePriceByDate && selectedPriceConfigs.length > 0 && (
          <span className="text-lg text-[#616161]">
            Đã chọn <b className="font-medium text-[#1f1f1f]">{selectedPriceConfigs.length}</b> ngày
          </span>
        )}
        {canConfigServicePriceByDate && (
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center gap-1 px-3 py-2 rounded-md bg-[#28642B] text-white font-semibold text-sm hover:cursor-pointer">
                <TicketIcon />
                Cấu hình
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              {selectedPriceConfigs.length > 0 ? <PriceConfigDistribution /> : <PriceRepeatConfigDistribution />}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </section>
  )
}

export default PriceConfigHeader
