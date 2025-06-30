import SolidLine from '@/components/widgets/solid-line'
import useKiosServices from '@/features/kios/hooks/use-kios-services'
import { useDraftOrders } from '@/features/kios/store/use-draft-orders'
import { formatCurrency } from '@/helper/number'
import { useOrderDetail } from '@/lib/api/queries/order/get-order-detail'
import { transformFullServiceName } from '@/utils/tranform-full-service-name'
import Image from 'next/image'
import { useMemo } from 'react'

const SummarySection = () => {
  const { currentDraftOrder } = useDraftOrders()

  const { data: services } = useKiosServices()

  // const currentActiveDraftOrder: DraftOrder | undefined = useMemo(() => {
  //   return draftOrders?.find((draftOrder: DraftOrder) => draftOrder?.active)
  // }, [draftOrders])

  const { data: booking } = useOrderDetail({
    variables: {
      id: currentDraftOrder?.bookingId as string,
    },
    enabled: !!currentDraftOrder?.bookingId,
    select: (data) => data.data,
    refetchInterval: 3000,
  })

  const servicesWithPrice = useMemo(() => {
    if (!services || !currentDraftOrder?.formData?.quantity) return []

    return services
      .map((service) => {
        const quantity = currentDraftOrder.formData?.quantity?.[service.priceConfigId] || 0
        const price = quantity * Number(service?.price ?? 0)
        return { ...service, quantity, price }
      })
      .filter((service) => service.quantity > 0)
  }, [services, currentDraftOrder?.formData?.quantity])

  const totals = useMemo(() => {
    return servicesWithPrice.reduce(
      (group, item) => ({
        totalPrice: group.totalPrice + item.price,
        totalQuantity: group.totalQuantity + item.quantity,
      }),
      { totalPrice: 0, totalQuantity: 0 },
    )
  }, [servicesWithPrice])

  return (
    <div className="flex-1 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(9,9,11,0.05)] outline outline-1 outline-offset-[-0.50px] outline-low z-10">
      <div className="flex flex-col h-full">
        <div className="text-base font-semibold px-6 py-2 border-b border-low bg-neutral-grey-50">
          Hoá đơn thanh toán
        </div>

        {booking?.payooData?.PaymentUrl ? (
          <div className="p-6 flex flex-col gap-4 items-center">
            <div className="rounded-[20px] outline outline-2 outline-offset-[-2px] outline-neutral-grey-200 p-10 flex justify-center items-center overflow-hidden w-full max-w-[280px]">
              <Image
                src={booking?.payooData?.PaymentUrl}
                alt="payoo-qr"
                className="w-full h-full aspect-square object-cover"
                width={200}
                height={200}
                style={{
                  objectPosition: '0px 25%',
                  clipPath: 'inset(10px)',
                }}
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold after:content-['đ'] after:ml-1">
                {formatCurrency(booking.totalPaid, {}, 'en-US')}
              </div>
              <div className="text-sm font-medium text-neutral-grey-500">
                Vui lòng quét mã QR để thực hiện thanh toán
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-6 overflow-y-auto">
            {servicesWithPrice?.length ? (
              servicesWithPrice?.map((service) => (
                <div className="flex gap-8 justify-between" key={service?.priceConfigId}>
                  <div className="flex gap-4 text-neutral-grey-600">
                    <div className="font-semibold">x{service?.quantity}</div>
                    <div className="font-medium text-neutral-grey-400">{transformFullServiceName(service)}</div>
                  </div>
                  <div className="ml-auto font-semibold after:content-['₫'] after:ml-1">
                    {service?.price ? formatCurrency(service?.price) : '0'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-neutral-grey-400">Chưa chọn dịch vụ nào</div>
            )}
          </div>
        )}

        <div className="p-6 flex flex-col gap-6 mt-auto">
          {currentDraftOrder?.formData?.paymentNote && (
            <div className="bg-neutral-grey-50 rounded-xl flex flex-col gap-2 p-4">
              {currentDraftOrder?.formData?.paymentNote && (
                <div>
                  <div>Nội dung thanh toán</div>
                  <div className="text-sm text-neutral-grey-400">{currentDraftOrder?.formData?.paymentNote || '-'}</div>
                </div>
              )}

              {/* {currentActiveDraftOrder?.formData?.note && (
                <div>
                  <div>Ghi chú</div>
                  <div className="text-sm text-neutral-grey-400">{currentActiveDraftOrder?.formData?.note || '-'}</div>
                </div>
              )} */}
            </div>
          )}

          {!booking?.payooData?.PaymentUrl && (
            <>
              <SolidLine className="border-low" />
              <div className="flex gap-8 justify-between">
                <div className="flex gap-4 text-neutral-grey-600">
                  <div className="text-xl font-semibold">x{totals?.totalQuantity || 0}</div>
                  <div className="text-lg font-medium text-neutral-grey-400">Vé tổng cộng</div>
                </div>
                <div className=" ml-auto text-xl font-semibold after:content-['đ'] after:ml-1">
                  {totals?.totalPrice ? formatCurrency(totals?.totalPrice) : '0'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SummarySection
