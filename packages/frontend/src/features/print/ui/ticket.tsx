'use client'
import { ComponentProps, Fragment, memo, useImperativeHandle, useRef } from 'react'
import QRCode from 'react-qr-code'

import DashedLine from '@/components/widgets/dashed-line'
import SolidLine from '@/components/widgets/solid-line'
import { IOrder } from '@/lib/api/queries/order/schema'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { appDayJs } from '@/utils/dayjs'
import PrintPortal from '../components/print-portal'
import PrintLayout from '../layouts/print-layout'
import { PrintType } from '../types'

export interface TicketProps extends ComponentProps<'div'> {
  ticket: IIssuedTicket
  booking?: IOrder
  isView?: boolean
}

export interface TicketProps extends ComponentProps<'div'> {
  ticket: IIssuedTicket
  booking?: IOrder
  isView?: boolean
}

// Data as props
const Ticket = ({ ref, ticket, booking, className, isView }: TicketProps) => {
  const printRef = useRef<HTMLDivElement | null>(null)
  useImperativeHandle(ref, () => printRef.current as HTMLDivElement)

  const data = [
    {
      label: 'Ngày sử dụng / Date',
      value: ticket?.expiryDate ? appDayJs(ticket?.expiryDate).format('DD/MM/YYYY') : '',
    },
    {
      label: 'Ngày hết hạn / Exp date',
      value: ticket?.expiryDate ? appDayJs(ticket?.expiryDate).format('DD/MM/YYYY') : '',
    },
    {
      label: 'Số / Receipt No',
      value: booking?.receiptNumber ?? ticket?.booking?.receiptNumber,
    },

    {
      label: 'Thời gian in / Print time',
      value: appDayJs(
        ticket?.printTimes?.length ? ticket?.printTimes[ticket?.printTimes?.length - 1] : appDayJs(),
      ).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      label: 'STT / Serial No',
      value: ticket?.ticketIndex || 0,
    },
    {
      label: 'In lần / Print count',
      value: ticket?.printCount || 1,
    },
  ]

  const ticketLayout = (
    <PrintLayout className="issued-ticket" ref={printRef}>
      <div className="flex items-end gap-1">
        <QRCode size={70} value={ticket?.issuedCode as string} />
        <div className="text-xs font-semibold font-langfarm">
          <div className="after:content-[':']">Mã / Code</div>
          <div>{ticket?.issuedCode}</div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="font-langfarm font-semibold flex flex-col">
          <div className="text-xl">Dịch vụ / Service</div>
          <div className="text-sm">{ticket.title}</div>
        </div>
        <div className="grid grid-cols-[max-content_1fr] gap-x-1 max-w-full ">
          {data.map((item) => (
            <Fragment key={item.label}>
              <div className="break-words after:content-[':']">{item.label}</div>
              <div>{item.value}</div>
            </Fragment>
          ))}
        </div>
      </div>

      <DashedLine />

      <div>
        <div className="font-semibold">Lưu ý:</div>
        <div className="[&>*]:before:content-['-'] [&>*]:before:mr-1">
          <div>Dịch vụ có giá trị sử dụng trong ngày</div>
          <div>Dịch vụ không hoàn huỷ, không đổi ngày</div>
          <div>Mã QR dùng để kiểm soát qua cổng và chỉ dùng được 1 lần</div>
          <div>Quý khách có thể lưu trên điện thoại, không cần in giấy</div>
        </div>
      </div>

      <SolidLine />
    </PrintLayout>
  )

  return isView ? ticketLayout : <PrintPortal type={PrintType.TICKET}>{ticketLayout}</PrintPortal>
}

export default memo(Ticket)
