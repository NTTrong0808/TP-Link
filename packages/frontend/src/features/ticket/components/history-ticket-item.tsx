import ListDashesFilledIcon from '@/components/widgets/icons/list-dashes-filled-icon'
import { IssuedTicketHistoryStatusColor, IssuedTicketHistoryStatusLabel } from '@/constants/status'
import { URLS } from '@/constants/urls'
import { ISSUED_TICKET_HISTORY_STATUS } from '@/lib/api/queries/ticket/schema'
import { cn } from '@/lib/tw'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { ComponentProps } from 'react'

interface Props extends Partial<ComponentProps<'div'>> {
  createdAt?: Date | string
  issuedCode?: string
  status?: string
  reason?: string
}

const HistoryTicketItem = (props: Props) => {
  const router = useRouter()
  return (
    <div
      className="flex p-3 gap-3 justify-between items-center rounded-md bg-white cursor-pointer"
      onClick={() => {
        if (props.issuedCode && props.status !== ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID) {
          router.push(URLS.TICKET.SEARCH + `?search=${props.issuedCode}`)
        }
      }}
    >
      <div className={cn('flex-1 text-[#606060]')}>
        <div className="text-xs">{dayjs(props.createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>

        <div className="text-sm font-semibold">
          {props.status === ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID ? <></> : props.issuedCode}
        </div>

        <div
          className={cn(
            'text-sm font-semibold',
            IssuedTicketHistoryStatusColor[props.status as keyof typeof IssuedTicketHistoryStatusColor] ||
              IssuedTicketHistoryStatusColor.QR_CODE_INVALID,
          )}
        >
          {IssuedTicketHistoryStatusLabel[props.status as keyof typeof IssuedTicketHistoryStatusLabel] ||
            IssuedTicketHistoryStatusLabel.QR_CODE_INVALID}
        </div>

        {props.reason && props.status !== ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID && (
          <div className="text-sm">{props.reason}</div>
        )}
      </div>
      <div className={cn((!props?.status || props?.status === ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID) && 'hidden')}>
        <ListDashesFilledIcon className={cn('size-8 text-[#a6a6a6]')} />
      </div>
    </div>
  )
}

export default HistoryTicketItem
