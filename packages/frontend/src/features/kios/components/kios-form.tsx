import { useDialoger } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useCreateActionLogs } from '@/lib/api/queries/action-log/use-create-action-logs'
import { useCancelBookingOffline } from '@/lib/api/queries/booking/cancel-booking-offline'
import { useConfirmBookingOffline } from '@/lib/api/queries/booking/confirm-booking-offline'
import { useCreateBookingOffline } from '@/lib/api/queries/booking/create-booking-offline'
import { BookingItem } from '@/lib/api/queries/booking/schema'
import { CASH_PAYOO_TYPE } from '@/lib/api/queries/payment-method/schema'
import { useGetSaleChannels } from '@/lib/api/queries/sale-channel/get-sale-channels'
import { SALE_CHANNEL_RETAIL_CODE, SALE_CHANNEL_WS } from '@/lib/api/queries/service/get-services-by-sale-channel-code'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { transformFullServiceName } from '@/utils/tranform-full-service-name'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { defaultOrderFormData } from '../constants/order'
import { useOrderExpiryDate } from '../hooks/use-order-expiry-date'
import { useOrderActivation } from '../hooks/use-order-tab'
import { KIOS_TYPE, KiosCustomerFormSchemaType, kiosFormSchema, KiosFormSchemaType } from '../schemas/kios-form-schema'
import { useDraftOrders } from '../store/use-draft-orders'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'
import { usePosTerminal } from '../store/use-pos-terminal'
import { useKiosContext } from './kios-context'
import KiosPaymentConfirmationForm from './kios-payment-confirmation'
import KiosPaymentSuccessForm from './kios-payment-success'
import KiosWaitingPaymentForm from './kios-waiting-payment'

export interface KiosFormProps extends ComponentProps<'form'> {
  orderId?: string

  setBookingId: (bookingId: string) => void
}

const WS_CONDITION_TICKETS = 11

const KiosForm = ({ orderId, setBookingId, ...props }: KiosFormProps) => {
  const { addDialoger, closeDialogerById } = useDialoger()
  const [_, setActiveOrderTab] = useOrderActivation()
  const { data: saleChannels } = useGetSaleChannels()

  const [expiryDate] = useOrderExpiryDate()

  const { draftOrders, removeDraftOrder, updateDraftOrder } = useDraftOrders()
  const { posTerminal } = usePosTerminal()
  const { paymentMethods, postPaidPaymentMethods, services, setIsLoadingCreatingOrder } = useKiosContext()

  const servicesMap = useMemo(() => new Map(services.map((service) => [service.priceConfigId, service])), [services])

  const { mutateAsync: createBookingOffline, isPending: isCreatingBookingOffline } = useCreateBookingOffline({
    onSuccess: () => {
      toastSuccess('Đặt hàng thành công')
    },
  })

  const handlePostProcessOrder = () => {
    const nextDraftOrder = removeDraftOrder(orderId!)
    setActiveOrderTab(nextDraftOrder?.id || null)
  }

  const { mutateAsync: confirmBookingOffline } = useConfirmBookingOffline({
    onSuccess: () => {
      toastSuccess('Xác nhận thành công')
      handlePostProcessOrder()
    },
  })

  const handleCloseCurrentOrder = () => {
    toastSuccess('Xác nhận thành công')
    const nextDraftOrder = removeDraftOrder(orderId!)

    setActiveOrderTab(nextDraftOrder?.id || null)
  }

  const { mutateAsync: cancelBookingOffline } = useCancelBookingOffline({
    onSuccess: () => {
      toastSuccess('Hủy thành công')
      handlePostProcessOrder()
    },
  })

  const handleUpdateBookingId = (bookingId?: string | null) => {
    if (orderId && bookingId) {
      updateDraftOrder(orderId!, { bookingId })
    }
  }

  const form = useForm<KiosFormSchemaType>({
    resolver: zodResolver(kiosFormSchema),
    defaultValues: draftOrders?.find((order) => order.id === orderId)?.formData ?? defaultOrderFormData,
  })

  const logAction = useOrderActionsLogsStore((s) => s.logAction)

  const actions = useOrderActionsLogsStore((s) => s.actions)
  const { mutate: sendLogs } = useCreateActionLogs()
  const getPayload = useOrderActionsLogsStore((s) => s.getPayload)
  const resetSession = useOrderActionsLogsStore((s) => s.resetSession)

  const handleFinishOrder = () => {
    try {
      const dto = getPayload()
      sendLogs({ dto }) // gửi log
      resetSession() // reset session mới
    } catch (err) {
      console.error('Lỗi gửi order action logs:', err)
    }
  }

  const handleConfirmBooking = async (bookingId: string, dialogId: string) => {
    logAction('Xác nhận đơn hàng', {
      bookingId,
    })
    await confirmBookingOffline({
      bookingId,
    })
    // await handlePrint('all', { bookingId })

    // set booking id to print
    if (bookingId) {
      setBookingId(bookingId)
    }

    handleUpdateBookingId(bookingId)
    addDialoger({
      variant: 'dialog',
      content: <KiosPaymentSuccessForm bookingId={bookingId} />,
      disableCloseOutside: true,
      hideXIcon: true,
    })
    closeDialogerById(dialogId)
    // window.open(URLS.TICKET.INDEX.replace(":id", bookingId), "_blank");
  }

  const handleCancelBooking = async (bookingId: string, dialogId: string) => {
    logAction('Hủy đơn hàng', {
      bookingId,
    })
    await cancelBookingOffline({
      bookingId,
    })
    handleFinishOrder()
    handleUpdateBookingId(null)
    closeDialogerById(dialogId)
  }

  const isValidateWsQuantity = (serviceIds: BookingItem[]) => {
    const wsSaleChannel = saleChannels?.data?.find((saleChannel) => saleChannel?.code === SALE_CHANNEL_WS)
    if (wsSaleChannel?.isActive === false || wsSaleChannel?.services?.length === 0) return true

    const wsServices = services
      .filter((service) => service?.saleChannelCode === SALE_CHANNEL_WS)
      .map((e) => e.priceConfigId)
    const filteredServices = serviceIds.filter((service) => wsServices.includes(service.priceConfigId))
    if (
      filteredServices.length &&
      filteredServices.some((service) => service.quantity > 0) &&
      filteredServices.reduce((total, service) => total + service.quantity, 0) < WS_CONDITION_TICKETS
    ) {
      toastError('Số lượng vé bán sỉ không hợp lệ.')
      return false
    }
    return true
  }

  const isValidateRetailQuantity = (serviceIds: BookingItem[]) => {
    const wsSaleChannel = saleChannels?.data?.find((saleChannel) => saleChannel?.code === SALE_CHANNEL_WS)
    if (wsSaleChannel?.isActive === false || wsSaleChannel?.services?.length === 0) return true

    const rtServices = services
      .filter((service) => service?.saleChannelCode === SALE_CHANNEL_RETAIL_CODE)
      .map((e) => e.priceConfigId)
    const filteredServices = serviceIds.filter((service) => rtServices.includes(service.priceConfigId))
    if (
      filteredServices.length &&
      filteredServices.some((service) => service.quantity > 0) &&
      filteredServices.reduce((total, service) => total + service.quantity, 0) >= WS_CONDITION_TICKETS
    ) {
      toastError('Số lượng vé bán lẻ không hợp lệ.')
      return false
    }
    return true
  }

  const isValidateSaleChannel = (serviceIds: BookingItem[]) => {
    const wsSaleChannel = saleChannels?.data?.find((saleChannel) => saleChannel?.code === SALE_CHANNEL_WS)
    if (wsSaleChannel?.isActive === false || wsSaleChannel?.services?.length === 0) return true

    const rtServices = services
      .filter((service) => service?.saleChannelCode === SALE_CHANNEL_RETAIL_CODE)
      .map((e) => e.priceConfigId)
    const wsServices = services
      .filter((service) => service?.saleChannelCode === SALE_CHANNEL_WS)
      .map((e) => e.priceConfigId)
    const filteredRTServices = serviceIds.filter((service) => rtServices.includes(service.priceConfigId))
    const filteredWSServices = serviceIds.filter((service) => wsServices.includes(service.priceConfigId))
    if (
      filteredRTServices?.reduce((total, service) => total + service.quantity, 0) > 0 &&
      filteredWSServices?.reduce((total, service) => total + service.quantity, 0) > 0
    ) {
      toastError(' Vui lòng điều chỉnh số lượng. Chỉ có thể chọn bán giá sỉ hoặc lẻ trên mỗi đơn hàng.')
      return false
    }
    return true
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      logAction('Thanh toán đơn hàng', {})

      const isCashMethod =
        paymentMethods?.find((method) => method._id === values.paymentMethod)?.payooType === CASH_PAYOO_TYPE
      const items = Object.entries(values.quantity)
        .map<BookingItem>(([priceConfigId, quantity]) => ({
          serviceId: servicesMap.get(priceConfigId)?._id ?? '',
          priceConfigId: priceConfigId,
          title: servicesMap.get(priceConfigId)?.title?.vi
            ? transformFullServiceName(servicesMap.get(priceConfigId)!)
            : 'unknown service name',
          shortTitle: servicesMap.get(priceConfigId)?.shortTitle?.vi || 'unknown service name',
          quantity: quantity ?? 0,
          price: servicesMap.get(priceConfigId)?.price ?? 0,
          serviceCode: servicesMap.get(priceConfigId)?.serviceCode ?? undefined,
          targetId: servicesMap.get(priceConfigId)?.targetId ?? undefined,
          saleChannelId: servicesMap.get(priceConfigId)?.saleChannelId ?? undefined,
        }))
        .filter((item) => Boolean(item?.serviceId))

      const isValid = isValidateSaleChannel(items)

      if (!isValid) return

      const isValidWS = isValidateWsQuantity(items)

      if (!isValidWS) return

      const isValidRT = isValidateRetailQuantity(items)

      if (!isValidRT) return

      const customerData = Object.entries(values?.customer ?? {})
        .filter(([_, value]) => value)
        .reduce((acc, [key, value]) => {
          ;(acc as any)[key] = value
          return acc
        }, {} as KiosCustomerFormSchemaType)

      const newCustomerData = Object.entries(values?.newCustomer ?? {})
        .filter(([_, value]) => value)
        .reduce((acc, [key, value]) => {
          ;(acc as any)[key] = value
          return acc
        }, {} as KiosCustomerFormSchemaType)

      const payload = {
        createdAt: appDayJs(expiryDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        items: isCashMethod ? items : items.filter((item) => item.title !== 'unknown service name'),
        paymentMethodId: values.paymentMethod,
        bankAccountId: values?.bankAccount,
        taId: values?.ta,
        vatInfo:
          values.type === KIOS_TYPE.COMPANY && values?.vat && values?.vat?.taxCode
            ? {
                address: values?.vat?.address?.trim() || '',
                legalName: values?.vat?.companyName?.trim() || '',
                receiverEmail: values?.vat?.email?.trim() || '',
                taxCode: +values?.vat?.taxCode === 0 ? '' : values?.vat?.taxCode?.trim() || '',
                note: values?.vat?.note?.trim() || '',
              }
            : undefined,
        note: values?.note,
        paymentNote: values?.paymentNote,
        customerData:
          values.type === KIOS_TYPE.PERSONAL && customerData && customerData?.name && customerData?.icNumber
            ? customerData
            : undefined,
        newCustomerData:
          values?.newCustomer && newCustomerData?.name && newCustomerData?.icNumber ? newCustomerData : undefined,
        isCash: isCashMethod,
        posCode: posTerminal?.posCode,
        posTerminalId: posTerminal?._id,
      }

      const createBookingRes = await createBookingOffline(payload)
      const bookingId = createBookingRes?.data?._id
      const bookingCode = createBookingRes?.data?.bookingCode
      const isPostPaid = postPaidPaymentMethods?.find(
        (method) => method?._id?.toString() === values?.paymentMethod?.toString(),
      )

      if (isPostPaid && values?.bankAccount && createBookingRes?.data?.bankAccountId) {
        handlePostProcessOrder()
        return
      }

      handleUpdateBookingId(bookingId)

      addDialoger({
        variant: 'dialog',
        content: isCashMethod ? (
          <KiosPaymentConfirmationForm
            onConfirm={async (bookingId, dialogId) => await handleConfirmBooking(bookingId, dialogId)}
            onCancel={async (bookingId, dialogId) => await handleCancelBooking(bookingId, dialogId)}
            bookingId={bookingId}
            bookingCode={bookingCode}
          />
        ) : (
          <KiosWaitingPaymentForm
            onCancel={async (bookingId, dialogId) => await handleCancelBooking(bookingId, dialogId)}
            onConfirm={async (bookingId, dialogId) => await handleConfirmBooking(bookingId, dialogId)}
            bookingId={bookingId}
            bookingCode={bookingCode}
            handleCloseCurrentOrder={handleCloseCurrentOrder}
          />
        ),
        disableCloseOutside: true,
        hideXIcon: true,
      })
    } catch (error) {
      console.error('Không thể tạo đơn hàng:', error)
      toastError(error)
    }
  })

  useEffect(() => {
    setIsLoadingCreatingOrder(isCreatingBookingOffline)
  }, [isCreatingBookingOffline])

  return (
    <FormProvider {...form}>
      <form {...props} onSubmit={handleSubmit} className={cn(props.className)} id="kios-form" />
    </FormProvider>
  )
}

export default KiosForm
