'use client'

import { AdvancedTable, ColumnDefExtend } from '@/components/advanced-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { TimelineStepper } from '@/components/ui/stepper'
import { useDialoger } from '@/components/widgets/dialoger'
import LeftArrowIcon from '@/components/widgets/icons/left-arrow-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { formatCurrency } from '@/helper'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import useHeader from '@/layouts/panel/use-header'
import { useHaravanOrderDetail } from '@/lib/api/queries/haravan-orders/get-order-detail'
import { useGetVatInvoiceByTransId } from '@/lib/api/queries/haravan-orders/get-vat-invoice-by-transId'
import {
  LineItem2,
  ORDER_FULFILMENT_STATUS_LABEL,
  OrderChannel,
  OrderFinancialStatus,
  OrderFulfilmentStatus,
  OrderHistoryStatus,
  OrderStatus,
} from '@/lib/api/queries/haravan-orders/type'
import { useUpdateOrderNote } from '@/lib/api/queries/haravan-orders/update-order-note'
import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { useIsFetching } from '@tanstack/react-query'
import { EyeIcon, PackageIcon, SquarePenIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { ComponentProps, Fragment } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useUpdateEffect } from 'react-use'
import { ME_INVOICE_ENUM } from '../../../../../backend/src/enums/meinvoice.enum'
import EditVatInfo from '../components/edit-vat-info'
import {
  CHANNEL_ICON,
  FINANCIAL_STATUS_LABEL,
  INVOICE_SYMBOL,
  ORDER_HISTORY_STATUS_ICON,
  ORDER_HISTORY_STATUS_LABEL,
} from '../constants/constant'
import { mappingPaymentMethod } from '../utils'

const STATUS_BADGE_VARIANT = {
  [OrderStatus.PROCESSING]: 'warning',
  [OrderStatus.COMPLETED]: 'default',
  [OrderStatus.CANCELLED]: 'destructive',
  [OrderStatus.RETURNED]: 'secondary',
} as Record<OrderStatus, BadgeProps['variant']>

const DELIVERY_STATUS_BADGE_VARIANT = {
  [OrderFulfilmentStatus.WAITING_FOR_PICKUP]: 'warning', // Chờ lấy hàng
  [OrderFulfilmentStatus.PICKING_UP]: 'default', // Đang đi lấy
  [OrderFulfilmentStatus.DELIVERING]: 'default', // Đang giao hàng
  [OrderFulfilmentStatus.DELIVERED]: 'default', // Đã giao hàng
  [OrderFulfilmentStatus.DELIVERY_CANCELED]: 'destructive', // Hủy giao hàng
  [OrderFulfilmentStatus.RETURNED]: 'destructive', // Chuyển hoàn
  [OrderFulfilmentStatus.NOT_DELIVERED_YET]: 'destructive', // Chưa giao hàng
  [OrderFulfilmentStatus.CUSTOMER_NOT_FOUND]: 'destructive', // Không gặp khách
  [OrderFulfilmentStatus.WAITING_FOR_RETURN]: 'destructive', // Chờ chuyển hoàn
  [OrderFulfilmentStatus.INCOMPLETE]: 'destructive', // Chưa hoàn thành
  [OrderFulfilmentStatus.DELIVERY_FAILED]: 'destructive', // Lỗi giao hàng
  [OrderFulfilmentStatus.PICKUP_FAILED]: 'destructive', // Lấy hàng thất bại
} as Record<OrderFulfilmentStatus, BadgeProps['variant']>

const HaravanOrderDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const { addDialoger } = useDialoger()

  useHeader({ isBack: true })

  const isFetching = useIsFetching()

  const {
    data,
    refetch,
    isFetching: isFetchingOrderDetail,
  } = useHaravanOrderDetail({
    variables: {
      id: id as string,
    },
    select: (data) => data.data,
    enabled: !!id,
  })

  const isHasVatInvoice = Boolean(
    data?.invoiceData ||
      data?.invoiceIssuedData?.transId ||
      (data?.invoiceCreatedAt && appDayJs(data?.invoiceCreatedAt).isValid()),
  )

  const { mutate: getVatInvoice, isPending: isFetchingVatInvoice } = useGetVatInvoiceByTransId({
    onSuccess: (data, variables) => {
      const url = URL.createObjectURL(data)
      window.open(url, '_blank')
    },
    onError: (error, variables) => {
      toastError('Lỗi khi xem hóa đơn VAT')
    },
  })

  const { mutate: updateOrderNote, isPending: isUpdatingOrderNote } = useUpdateOrderNote({
    onSuccess: () => {
      refetch()
      toastSuccess('Cập nhật ghi chú đơn hàng thành công')
    },
    onError: (error) => {
      toastError(error)
    },
  })

  const form = useForm({
    defaultValues: {
      note: data?.note,
    },
  })

  useUpdateEffect(() => {
    if (!isFetchingOrderDetail && data) {
      form.setValue('note', data?.note || '')
    }
  }, [isFetchingOrderDetail, data])

  const handleUpdateNote = form.handleSubmit((data) => {
    updateOrderNote({
      id: id as string,
      note: data.note,
    })
  })

  const handleEditVatInfo = () => {
    addDialoger({
      title: 'Thông tin xuất VAT',
      content: (
        <EditVatInfo
          defaultValues={{
            vatInfo: {
              legalName: data?.vatData?.legalName || '',
              address: data?.vatData?.address || '',
              receiverEmail: data?.vatData?.receiverEmail || '',
              note: data?.vatData?.note,
            },
            taxCode: data?.vatData?.taxCode,
          }}
          orderId={id as string}
        />
      ),
      variant: 'dialog',
      disableCloseOutside: true,
      hideXIcon: true,
    })
  }

  const productColumns: ColumnDefExtend<LineItem2>[] = [
    {
      header: () => <div className="text-base font-semibold">Sản phẩm</div>,
      accessorKey: 'dwTitle',
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            <div className="">{row.original?.dwTitle || row.original?.name || ''}</div>
            <div className="text-neutral-grey-400">SKU: {row.original?.sku || ''}</div>
          </div>
        )
      },
      enableSorting: false,
      className: 'border-none',
      footer: () => {
        return 'Tổng cộng:'
      },
    },

    {
      header: () => <div className="text-center justify-self-center font-normal">SL</div>,
      accessorKey: 'quantity',
      meta: {
        textAlign: 'right',
        justifyContent: 'center',
      },
      footer: () => {
        return formatCurrency(data?.lineItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0)
      },
      enableSorting: false,
      className: 'border-none text-end w-12',
    },
    {
      header: () => <div className="text-center justify-self-center font-normal">Giá bán</div>,
      accessorKey: 'price',
      cell: (props) => {
        return formatCurrency(props.row.original?.price || 0, { currency: 'VND', style: 'currency' })
      },
      meta: {
        textAlign: 'right',
        justifyContent: 'center',
      },
      footer: () => {
        return formatCurrency(data?.lineItems?.reduce((acc, item) => acc + (item.price || 0), 0) || 0, {
          currency: 'VND',
          style: 'currency',
        })
      },
      enableSorting: false,
      className: 'border-none text-end w-32',
    },
    {
      header: () => <div className="text-center w-24 justify-self-center font-normal">Tiền chiết khấu</div>,
      accessorKey: 'total_discount',
      cell: (props) => {
        return formatCurrency(props.row.original?.total_discount || 0, { currency: 'VND', style: 'currency' })
      },
      meta: {
        textAlign: 'right',
        justifyContent: 'center',
      },
      footer: () => {
        return formatCurrency(data?.lineItems?.reduce((acc, item) => acc + (item.total_discount || 0), 0) || 0, {
          currency: 'VND',
          style: 'currency',
        })
      },
      enableSorting: false,
      className: 'border-none text-end w-32',
    },
    {
      header: () => <div className="text-center w-24 justify-self-center font-normal">Thành tiền trước thuế</div>,
      accessorKey: 'total_price_before_vat',
      cell: (props) => {
        const totalPrice = (props.row.original?.price || 0) * (props.row.original?.quantity || 0)

        const vat = totalPrice * ME_INVOICE_ENUM.VAT_RATE

        return formatCurrency(totalPrice - vat, {
          currency: 'VND',
          style: 'currency',
        })
      },
      footer: () => {
        const totalPrice =
          data?.lineItems?.reduce((acc, item) => acc + (item?.price || 0) * (item?.quantity || 0), 0) || 0
        const vat = totalPrice * ME_INVOICE_ENUM.VAT_RATE

        return formatCurrency(totalPrice - vat, {
          currency: 'VND',
          style: 'currency',
        })
      },

      meta: {
        textAlign: 'right',
        justifyContent: 'end',
      },
      enableSorting: false,
      className: 'border-none text-end w-32',
    },
    {
      header: () => <div className="text-center w-20 justify-self-center font-normal">Thuế suất GTGT</div>,
      accessorKey: 'tax',
      cell: (props) => {
        return formatCurrency(ME_INVOICE_ENUM.VAT_RATE, { style: 'percent' })
      },

      enableSorting: false,
      className: 'border-none text-end w-20',
    },
    {
      header: () => <div className="text-center w-24 justify-self-center font-normal">Tiền thuế GTGT</div>,
      accessorKey: 'total_tax',
      cell: (props) => {
        const totalPrice = (props.row.original?.price || 0) * (props.row.original?.quantity || 0)
        const vat = totalPrice * ME_INVOICE_ENUM.VAT_RATE

        return <span>{formatCurrency(vat, { currency: 'VND', style: 'currency' })}</span>
      },
      footer: () => {
        const totalPrice =
          data?.lineItems?.reduce((acc, item) => acc + (item?.price || 0) * (item?.quantity || 0), 0) || 0
        const vat = totalPrice * ME_INVOICE_ENUM.VAT_RATE

        return formatCurrency(vat, { currency: 'VND', style: 'currency' })
      },
      enableSorting: false,
      className: 'border-none text-end w-32',
    },
    {
      header: () => <div className="text-center w-24 justify-self-center font-normal">Thành tiền sau thuế</div>,
      accessorKey: 'total_price',
      cell: (props) => {
        const totalPrice = (props.row.original?.price || 0) * (props.row.original?.quantity || 0)

        return formatCurrency(totalPrice, {
          currency: 'VND',
          style: 'currency',
        })
      },
      footer: () => {
        const totalPrice =
          data?.lineItems?.reduce((acc, item) => acc + (item?.price || 0) * (item?.quantity || 0), 0) || 0

        return (
          <span className="text-primary-orange-400">
            {formatCurrency(totalPrice, { currency: 'VND', style: 'currency' })}
          </span>
        )
      },
      enableSorting: false,
      className: 'border-none text-end w-32',
    },
  ]

  const dataField = {
    customer: [
      {
        label: 'Nhóm khách',
        value: '-',
      },
      {
        label: 'Thông tin khách hàng',
        value: data?.haravanData?.shipping_address?.name,
      },
      {
        label: 'Thông tin giao hàng',
        value: [
          data?.haravanData?.shipping_address?.address1,
          data?.haravanData?.shipping_address?.address2,
          data?.haravanData?.shipping_address?.ward,
          data?.haravanData?.shipping_address?.district,
          data?.haravanData?.shipping_address?.province,
          data?.haravanData?.shipping_address?.country,
        ]
          .filter(Boolean)
          .join(', '),
      },
      {
        label: 'Ghi chú về khách hàng',
        value: data?.haravanData?.note,
      },
    ],

    vat: [
      {
        label: 'Tên cá nhân/doanh nghiệp',
        value: data?.vatData?.legalName,
      },
      {
        label: 'Mã số thuế',
        value: data?.vatData?.taxCode,
      },
      {
        label: 'Địa chỉ',
        value: data?.vatData?.address,
      },
      {
        label: 'Email',
        value: data?.vatData?.receiverEmail,
      },
      {
        label: 'Ghi chú',
        value: data?.vatData?.note,
      },
      {
        label: 'Ký hiệu',
        value: data?.invoiceIssuedData?.invNo ? INVOICE_SYMBOL : '-',
      },
      {
        label: 'Số hoá đơn',
        value: data?.invoiceIssuedData?.invNo,
      },
      {
        label: 'Ngày hoá đơn',
        value: appDayJs(data?.invoiceCreatedAt).format('DD/MM/YYYY HH:mm:ss'),
      },
      {
        label: 'Mã CQT',
        value: data?.invoiceIssuedData?.invCode,
      },
    ],

    payment: [
      {
        label: 'Trạng thái',
        value:
          FINANCIAL_STATUS_LABEL[data?.haravanData?.financial_status as OrderFinancialStatus] ||
          data?.haravanData?.financial_status ||
          'Không rõ',
      },
      {
        label: 'Hình thức thanh toán',
        value: mappingPaymentMethod(data?.paymentMethod),
      },
      {
        label: 'Số lượng sản phẩm',
        value: data?.lineItems?.reduce((acc, item) => acc + (item.quantity || 0), 0),
      },
      {
        label: 'Tổng tiền hàng',
        value: formatCurrency(data?.haravanData?.total_price, {
          currency: 'VND',
          style: 'currency',
        }),
      },

      {
        label: (
          <div className="">
            <div>Vận chuyển</div>
            <div className="text-neutral-grey-400 text-xs">
              {data?.haravanData?.shipping_lines?.[0]?.title} {(data?.haravanData?.total_weight || 0) / 1000} kg
            </div>
          </div>
        ),
        key: 'Vận chuyển',
        value: formatCurrency(data?.haravanData?.shipping_lines?.[0]?.price || 0, {
          currency: 'VND',
          style: 'currency',
        }),
      },
    ],
    total: [
      {
        label: 'Tổng giá trị đơn hàng',
        value: formatCurrency((data?.haravanData?.total_price || 0) - (data?.haravanData?.total_tax || 0), {
          currency: 'VND',
          style: 'currency',
        }),
      },
      {
        label: 'Đã hoàn trả',
        value: formatCurrency(0, {
          currency: 'VND',
          style: 'currency',
        }),
      },
      {
        label: 'Thực nhận',
        value: formatCurrency((data?.haravanData?.total_price || 0) - (data?.haravanData?.total_tax || 0), {
          currency: 'VND',
          style: 'currency',
        }),
      },
    ],
  }

  return (
    <>
      <div className={cn('sticky top-0 flex justify-between shrink-0 items-center bg-background px-3 py-2')}>
        <div
          onClick={() => {
            router.back()
          }}
          className="flex items-center gap-2 text-sm font-medium cursor-pointer h-8"
        >
          <LeftArrowIcon className="text-neutral-400 h-6 w-6" />
          Quay lại
        </div>
      </div>
      <PanelView>
        <PanelViewContent className="flex flex-col gap-5" loading={!!isFetching}>
          <CardDetail className="text-neutral-grey-400 text-sm flex flex-col md:flex-row flex-wrap gap-8 md:items-center">
            <div>
              <div>Mã đơn hàng</div>
              <div className="text-semantic-info-300 text-lg">{data?.orderNumber}</div>
              <div>{appDayJs(data?.createdAt).format('DD/MM/YYYY HH:mm')}</div>
            </div>
            <div className="self-stretch hidden md:block w-px bg-neutral-grey-100" />

            {/* Status */}
            <div className="flex gap-3">
              <div className="size-11 rounded-md bg-primary-orange-10 text-orange-400 p-3">
                <PackageIcon className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-1">
                <div>Trạng thái đơn hàng</div>
                <div>
                  <Badge
                    variant={STATUS_BADGE_VARIANT?.[data?.status as OrderStatus] || 'secondary'}
                    corner="full"
                    className="text-nowrap"
                  >
                    {ORDER_STATUS_LABEL[data?.status as keyof typeof ORDER_STATUS_LABEL] || data?.status || 'Không rõ'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="self-stretch hidden md:block w-px bg-neutral-grey-100" />
            <div className="flex gap-3">
              <div className="size-11 rounded-md bg-primary-orange-10 text-orange-400 p-3">
                <TruckIcon className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-1">
                <div>Trạng thái giao hàng</div>
                <div>
                  <Badge
                    variant={
                      DELIVERY_STATUS_BADGE_VARIANT?.[data?.fulfilmentStatus as OrderFulfilmentStatus] || 'secondary'
                    }
                    corner="full"
                    className="text-nowrap"
                  >
                    {ORDER_FULFILMENT_STATUS_LABEL[
                      data?.fulfilmentStatus as keyof typeof ORDER_FULFILMENT_STATUS_LABEL
                    ] ||
                      data?.fulfilmentStatus ||
                      'Không rõ'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="self-stretch hidden md:block w-px bg-neutral-grey-100" />
            <div className="flex gap-5">
              <div className="p-2 border border-neutral-grey-200 rounded-md flex flex-col justify-center items-center gap-1">
                {data?.channel && CHANNEL_ICON[data?.channel as OrderChannel] ? (
                  <Image
                    src={CHANNEL_ICON[data?.channel as OrderChannel]}
                    alt={data?.channel as string}
                    width={24}
                    height={24}
                  />
                ) : null}
                <div className="rounded-sm px-1 py-0.5 bg-neutral-grey-100 text-neutral-grey-600 font-semibold capitalize">
                  {data?.haravanData?.source_name}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5 [&>div>div:first-child]:font-medium [&>div>div:first-child]:text-neutral-black">
                <div>
                  <div>Mã gian hàng</div>
                  <div>-</div>
                </div>
                <div>
                  <div>Kho bán</div>
                  <div>-</div>
                </div>
                <div>
                  <div>Gian hàng</div>
                  <div>-</div>
                </div>
                <div>
                  <div>Nhân viên tạo</div>
                  <div>-</div>
                </div>
              </div>
            </div>
          </CardDetail>
          <div className="flex flex-col xl:flex-row gap-5">
            {/* Left */}
            <div className="flex flex-col gap-5 flex-[2_1_0] xl:w-96">
              <AdvancedTable
                data={data?.lineItems || []}
                columns={productColumns}
                pagination={{ hidden: true }}
                tableClassName="text-pretty"
              />
              <CardDetail title="Thông tin Thanh toán" className="flex flex-col md:flex-row gap-x-10 gap-y-4">
                <div className="grid gap-x-2 gap-y-4 grid-cols-[max-content_1fr] flex-1">
                  {dataField.payment.map((item) => (
                    <Fragment key={(item?.key || item?.label) as string}>
                      <div>{item.label}</div>
                      <div className="text-end text-neutral-grey-400">{item?.value || '-'}</div>
                    </Fragment>
                  ))}
                  <div className="h-px bg-neutral-grey-100 col-span-2" />
                  {dataField.total.map((item, index) => (
                    <Fragment key={item.label}>
                      <div className={cn(index === 0 && 'font-semibold')}>{item.label}</div>
                      <div className={cn('text-end', index === 0 && 'font-semibold')}>{item?.value || '-'}</div>
                    </Fragment>
                  ))}
                </div>
                <div className="flex-1">
                  <FormProvider {...form}>
                    <form onSubmit={handleUpdateNote} className="flex flex-col gap-2">
                      <Field
                        name="note"
                        component="textarea"
                        rows={2}
                        label="Ghi chú đơn hàng"
                        placeholder="Thêm ghi chú đơn hàng"
                        className="w-full"
                      />
                      <div className="place-self-end">
                        <Button type="submit" variant="primary" loading={isUpdatingOrderNote}>
                          Cập nhật
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </CardDetail>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-5 flex-1">
              <CardDetail title="Thông tin Khách hàng" className="text-sm">
                <div className="grid gap-x-2 gap-y-4 grid-cols-[max-content_1fr]">
                  {dataField.customer.map((item) => (
                    <Fragment key={item.label}>
                      <div>{item.label}</div>
                      <div className="text-end">{item?.value || '-'}</div>
                    </Fragment>
                  ))}
                </div>

                <div className="h-px w-full bg-neutral-grey-100 my-4" />

                <div className="grid gap-4">
                  <div className="font-semibold flex items-center gap-2 justify-between">
                    <div>Thông tin xuất VAT</div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={!isHasVatInvoice}
                        onClick={() =>
                          data?.invoiceIssuedData?.transId &&
                          getVatInvoice({ transId: data?.invoiceIssuedData?.transId })
                        }
                        loading={isFetchingVatInvoice}
                      >
                        <EyeIcon className="text-neutral-grey-300" /> Xem VAT
                      </Button>
                      <Button variant="outline" onClick={handleEditVatInfo} disabled={isHasVatInvoice}>
                        <SquarePenIcon className="text-neutral-grey-300" /> Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-x-2 gap-y-4 grid-cols-[max-content_1fr]">
                    {dataField.vat.map((item) => (
                      <Fragment key={item.label}>
                        <div>{item.label}</div>
                        <div className="text-end">{item?.value || '-'}</div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </CardDetail>
              <CardDetail title="Lịch sử Đơn hàng">
                <TimelineStepper
                  steps={
                    data?.histories?.reverse()?.map((item) => ({
                      title: ORDER_HISTORY_STATUS_LABEL[item.status],
                      description:
                        item?.updatedAt && appDayJs(item?.updatedAt).isValid()
                          ? appDayJs(item?.updatedAt).format('DD/MM/YYYY HH:mm:ss')
                          : '',
                      icon: ORDER_HISTORY_STATUS_ICON[item.status],
                    })) || [
                      {
                        title: ORDER_HISTORY_STATUS_LABEL[OrderHistoryStatus.CREATED],
                        description: appDayJs(data?.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                        icon: ORDER_HISTORY_STATUS_ICON[OrderHistoryStatus.CREATED],
                      },
                    ]
                  }
                  color="primary"
                />
              </CardDetail>
            </div>
          </div>
        </PanelViewContent>
      </PanelView>
    </>
  )
}

export interface CardDetailProps extends ComponentProps<'div'> {
  title?: string
}

const CardDetail = ({ title, children, className }: CardDetailProps) => {
  return (
    <div className="grid bg-white rounded-md">
      <div className={cn('text-base font-semibold py-3 px-4 border-b border-neutral-grey-100', !title && 'hidden')}>
        {title}
      </div>
      <div className={cn('py-3 px-4 text-sm', className)}>{children}</div>
    </div>
  )
}

export default HaravanOrderDetail
