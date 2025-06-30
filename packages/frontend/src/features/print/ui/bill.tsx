'use client'
import { Fragment, memo, Ref, useImperativeHandle, useRef } from 'react'

import DashedLine from '@/components/widgets/dashed-line'
import SolidLine from '@/components/widgets/solid-line'
import { paymentMethodKey } from '@/features/kios/constants/payment-method'
import { formatCurrency } from '@/helper'
import { getInputVatUrl } from '@/helper/url'
import { IOrder } from '@/lib/api/queries/order/schema'
import dayjs from 'dayjs'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import { ME_INVOICE_ENUM } from '../../../../../backend/src/enums/meinvoice.enum'
import PrintPortal from '../components/print-portal'
import PrintLayout from '../layouts/print-layout'
import { PrintType } from '../types'

const Bill = ({ ref, booking }: { ref?: Ref<HTMLDivElement>; booking: IOrder }) => {
  const printRef = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => printRef.current as HTMLDivElement)

  const discount = booking?.discount
  const total = (booking?.totalPaid || 0) - (discount || 0)
  const isBankTransfer = booking?.paymentMethodId === paymentMethodKey.BANK_ACCOUNT || booking?.bankAccountId
  const isPayoo = booking?.payooData?.PaymentNo && true

  const data = {
    info: [
      {
        label: 'Số / Receipt No',
        value: booking?.receiptNumber,
      },
      {
        label: 'Số ĐH / Booking No',
        value: booking?.bookingCode,
      },
      {
        label: 'Ngày / Date',
        value: booking?.createdAt ? dayjs(booking?.createdAt).format('DD/MM/YYYY HH:mm:ss') : '',
      },
      // {
      //   label: 'Thời gian in / Print Time',
      //   value: dayjs(
      //     booking?.printTimes?.length ? booking?.printTimes?.[booking?.printTimes?.length - 1] : appDayJs(),
      //   ).format('DD/MM/YYYY HH:mm:ss'),
      // },
      {
        label: 'In lần / Print No',
        value: booking?.printCount || 1,
      },

      {
        label: 'Quầy / POS',
        value: booking?.posTerminalName,
      },
      {
        label: 'Thu ngân / Cashier',
        value: booking?.createdByName,
      },
    ],

    total: [
      {
        label: 'Tổng số lượng',
        value:
          booking?.items && booking?.items?.length > 0
            ? (booking?.items).reduce((acc, detail) => acc + (detail?.quantity || 0), 0)
            : 0,
      },
      {
        label: 'Giảm giá',
        value: discount ? formatCurrency(discount) : 0,
      },
      {
        label: 'Tiền trước GTGT',
        value: total > 0 ? formatCurrency(total - total * ME_INVOICE_ENUM.VAT_RATE) : 0,
      },
      {
        label: 'Tiền thuế GTGT',
        value: total > 0 ? formatCurrency(total * ME_INVOICE_ENUM.VAT_RATE) : 0,
      },

      {
        label: 'Tổng tiền thanh toán',
        value: total > 0 ? formatCurrency(total) : 0,
      },
    ].filter((item) => item.value),

    payment: [
      // {
      //   label: 'PTTT / Payment Type',
      //   value:
      //     booking?.paymentMethodName && booking?.payooData?.InvoiceNo
      //       : booking?.paymentMethodName || 'Không có',
      {
        label: 'Voucher',
        value: discount ? formatCurrency(discount) : 0,
      },
      {
        label: 'Tiền mặt',
        value: !(isBankTransfer || isPayoo) ? formatCurrency(total) : 0,
      },
      {
        label: 'Tiền thừa cần trả khách',
        value: 0,
      },
      {
        label: 'Chuyển khoản',
        value: isBankTransfer ? formatCurrency(total) : 0,
      },

      {
        label: 'Payoo',
        value: isPayoo ? formatCurrency(total) : 0,
      },
      {
        label: 'Mã thanh toán Payoo',
        value: booking?.payooData?.PaymentNo,
      },
      {
        label: 'Số HĐ Payoo',
        value: booking?.payooData?.InvoiceNo,
      },
      {
        label: 'Mã CC',
        value: booking?.payooData?.AuthorizationNo,
      },
      {
        label: 'Số TC',
        value: booking?.payooData?.ReferenceNo,
      },
      {
        label: 'Mã đơn hàng Payoo',
        value: booking?.payooData?.OrderCode,
      },
    ].filter((item) => item.value),
  }

  return (
    <PrintPortal type={PrintType.BILL}>
      <PrintLayout className="order-bill" ref={printRef}>
        <div className="flex flex-col">
          {/* Bill Title */}
          <div className="font-langfarm font-semibold">
            <div className="text-xl">Biên lai thanh toán</div>
            <div className="text-base">Payment Receipt</div>
          </div>

          {/* Barcode */}
          <div className="flex flex-col justify-center items-center">
            {booking?.receiptNumber && (
              <Barcode value={booking?.receiptNumber} className="w-full h-fit -px-5" height={30} displayValue={false} />
            )}
            {/* <div className="text-xl">{booking?.receiptNumber}</div> */}
          </div>

          {/* Bill Info */}
          <div className="grid grid-cols-[max-content_1fr] gap-x-1 max-w-full ">
            {data.info.map((item) => (
              <Fragment key={item.label}>
                <div className=" break-words after:content-[':']">{item.label}</div>
                <div>{item.value}</div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="grid grid-cols-7 gap-1 leading-4">
          <div className="font-semibold">
            SL
            <br />
            Qty
          </div>
          <div className="col-span-2 font-semibold text-right">
            Đơn giá
            <br />
            Price
          </div>
          <div className="col-span-2 font-semibold text-right">
            Thành tiền
            <br />
            Amount
          </div>
          <div className="col-span-2 font-semibold text-right">
            Thuế GTGT
            <br />
            VAT
          </div>

          <SolidLine />

          {/* Table Items */}
          {booking?.items?.map((item, index) => (
            <Fragment key={index}>
              <div className="col-span-full -mb-1">{item.title}</div>
              <div>{item.quantity}</div>
              <div className="col-span-2 text-right">{formatCurrency(item.price, {}, 'en-US')}</div>
              <div className="col-span-2 text-right">{formatCurrency(item.price * item.quantity, {}, 'en-US')}</div>
              <div className="col-span-2 text-right">{ME_INVOICE_ENUM.VAT_RATE_NAME}</div>
            </Fragment>
          ))}

          <DashedLine />

          {/* Total */}
          <div className="col-span-full [&>*:last-child]:font-bold">
            {data?.total?.map((item) => (
              <div className="flex gap-1" key={item.label}>
                <div className="after:content-[':']">{item.label}</div>
                <div className="ml-auto text-right">{item.value}</div>
              </div>
            ))}
          </div>

          <DashedLine />

          {/* Payment */}
          <div className="col-span-full">
            {data?.payment?.map((item) => (
              <div className="flex gap-1" key={item.label}>
                <div className="after:content-[':']">{item.label}</div>
                <div className="ml-auto text-right">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <SolidLine />

        <div className="grid grid-cols-[max-content_1fr] gap-2">
          <div className="">
            <QRCode
              className="bg-white text-black"
              size={100}
              value={getInputVatUrl(booking?._id, booking?.bookingVatToken || '')}
            />
          </div>
          <div className="leading-none  flex flex-col justify-between items-center">
            <div className="before:content-['|'] before:mr-0.5">
              Để xuất hóa đơn GTGT điện tử, vui lòng quét mã QR bên cạnh
            </div>
            <div className="before:content-['|'] before:mr-0.5">
              Biên lai thanh toán chỉ có giá trị xuất hóa đơn GTGT trong vòng 120 phút tính từ lúc in biên lai và trước
              22:00 giờ trong ngày mua hàng hoá / dịch vụ
            </div>
          </div>
        </div>
      </PrintLayout>
    </PrintPortal>
  )
}

export default memo(Bill)
