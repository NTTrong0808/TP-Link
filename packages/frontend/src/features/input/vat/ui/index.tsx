'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/form'
import { useDialoger } from '@/components/widgets/dialoger'
import ArrowsClockWiseIcon from '@/components/widgets/icons/arrows-clockwise-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { taxCodeRegex } from '@/constants/regex'
import { useGetBookingByIdAndVatToken } from '@/lib/api/queries/booking/get-booking-by-id-and-vat-token'
import { useUpdateBookingVatInfo } from '@/lib/api/queries/booking/update-booking-vat-info'
import { useGetVATInfo } from '@/lib/api/queries/viet-qr/get-vat-info'
import { appDayJs } from '@/utils/dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoIcon, Loader } from 'lucide-react'
import { ComponentProps, useRef } from 'react'
import Countdown from 'react-countdown'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce, useToggle, useUpdateEffect } from 'react-use'
import ExpireInputVat from '../components/expire-input-vat'
import SuccessDialog from '../components/success-dialog'
import { inputVatSchema, InputVatSchema } from '../schemas/input-vat-schema'

export interface InputVatProps {
  bookingId: string
  bookingVatToken: string
}

const InputVat = ({ bookingId, bookingVatToken }: InputVatProps) => {
  const form = useForm<InputVatSchema>({
    resolver: zodResolver(inputVatSchema),
  })

  const { addDialoger } = useDialoger()
  const vatRef = useRef<HTMLInputElement>(null)

  const [isConfirm, toggleIsConfirm] = useToggle(false)
  const [isExpired, setIsExpired] = useToggle(false)
  const [isSearch, toggleSearch] = useToggle(false)
  const [isSearchSuccess, toggleSearchSuccess] = useToggle(false)

  const [wTaxCode] = useWatch({
    control: form.control,
    name: ['taxCode'],
  })

  const { data: booking, isFetching: isFetchingBooking } = useGetBookingByIdAndVatToken({
    variables: {
      bookingId,
      bookingVatToken,
    },
    enabled: Boolean(bookingId) && Boolean(bookingVatToken),
    select: (data) => data.data,
  })

  useUpdateEffect(() => {
    if (!(booking?.bookingVatExpiredAt && appDayJs().isBefore(appDayJs(booking?.bookingVatExpiredAt)))) {
      setIsExpired(true)
    }
  }, [isFetchingBooking])

  const isInputTaxCode = wTaxCode?.length > 0 && taxCodeRegex.test(wTaxCode)

  const isZeroTaxCode = wTaxCode === '0'

  const isEnableSearch = isInputTaxCode && !isZeroTaxCode

  const {
    data: vatInfo,
    isFetching: isFetchingVAT,
    refetch,
  } = useGetVATInfo({
    variables: {
      taxCode: wTaxCode!,
    },
    enabled: isEnableSearch && isSearch,
  })

  // useUpdateEffect(() => {
  //   if (vatInfo) {
  //     form.clearErrors('taxCode')
  //   } else {
  //     form.setError('taxCode', {
  //       message: 'Mã số thuế không hợp lệ, vui lòng kiểm tra lại',
  //     })
  //   }
  // }, [isFetchingVAT])

  const { mutateAsync: updateBookingVatInfo, isPending: isLoadingUpdateBookingVatInfo } = useUpdateBookingVatInfo()

  const personalInfo: Array<ComponentProps<typeof Field> & { note?: string }> = [
    {
      label: 'Tên Công ty / Cá nhân',
      name: 'customer.name',
      type: 'text',
      placeholder: 'Nhập tên công ty / cá nhân',
      required: true,
      component: 'text',
    },
    {
      label: 'Số CCCD',
      name: 'customer.icNumber',
      type: 'number',
      placeholder: 'Nhập số CCCD',
      required: true,
      component: 'text',
    },
    {
      label: 'Số điện thoại',
      name: 'customer.phone',
      type: 'text',
      placeholder: 'Nhập số điện thoại',
      component: 'text',
    },
    {
      label: 'Email',
      name: 'customer.email',
      type: 'text',
      placeholder: 'Nhập email',
      component: 'text',
    },
    {
      label: 'Ghi chú',
      name: 'customer.note',
      type: 'text',
      placeholder: 'Nhập ghi chú',
      component: 'text',
    },
  ]

  const isDisableInput = !(isInputTaxCode && (isZeroTaxCode || isSearchSuccess))

  const companyInfo: Array<ComponentProps<typeof Field> & { note?: string }> = [
    {
      label: 'Tên Công ty / Cá nhân',
      name: 'vatInfo.legalName',
      placeholder: 'Nhập tên Công ty / Cá nhân',
      required: true,
      component: 'text',
      disabled: isDisableInput,
    },
    {
      label: 'Địa chỉ',
      name: 'vatInfo.address',
      placeholder: 'Nhập địa chỉ',
      required: true,
      component: 'text',
      disabled: isDisableInput,
    },
    {
      label: 'Email',
      name: 'vatInfo.receiverEmail',
      placeholder: 'Nhập email',
      required: true,
      component: 'text',
      note: 'Hoá đơn sẽ được gửi đến địa chỉ email này',
      // disabled: !isInputTaxCode,
    },
    {
      label: 'Ghi chú',
      name: 'vatInfo.note',
      placeholder: 'Nhập ghi chú',
      component: 'textarea',
    },
  ]

  const inputFields: Array<ComponentProps<typeof Field> & { note?: string }> = companyInfo

  useDebounce(
    () => {
      if (isSearch) {
        toggleSearch(false)
        toggleSearchSuccess(false)
      }

      form.setValue('vatInfo.legalName', '')
      form.setValue('vatInfo.address', '')
    },
    300,
    [wTaxCode],
  )

  useUpdateEffect(() => {
    vatRef?.current?.focus()
    if (!vatInfo?.data?.data) {
      if (isSearch && vatInfo?.data?.desc) {
        toastError('Mã số thuế không hợp lệ, vui lòng kiểm tra lại')
        toggleSearchSuccess(false)
      }
      return
    }
    if (isSearch && vatInfo?.data?.data) {
      if (vatInfo?.data?.desc) {
        toastSuccess(vatInfo?.data?.desc)
      }
      toggleSearchSuccess(true)
      form.clearErrors(['vatInfo.legalName', 'vatInfo.address'])
      form.setValue('vatInfo.legalName', vatInfo?.data?.data?.name)
      form.setValue('vatInfo.address', vatInfo?.data?.data?.address)
    }
  }, [vatInfo])

  const handleSubmit = async (data: InputVatSchema) => {
    try {
      await updateBookingVatInfo({
        bookingId: booking?._id || bookingId,
        bookingVatToken: booking?.bookingVatToken || bookingVatToken,
        vatInfo:
          'vatInfo' in data
            ? {
                taxCode: +data.taxCode === 0 ? '' : data.taxCode,
                ...data.vatInfo,
              }
            : {
                taxCode: +data.taxCode === 0 ? '' : data.taxCode,
                receiverEmail: data.customer.email,
                legalName: data.customer.name,
                address: '',
                note: data.customer.note,
              },
      })

      toastSuccess('Cập nhật thông tin xuất hoá đơn VAT thành công')
      addDialoger({
        variant: 'dialog',
        content: <SuccessDialog bookingCode={booking?.bookingCode} />,
        disableCloseOutside: true,
        hideXIcon: true,
      })
    } catch (error) {
      toastError('Cập nhật thông tin xuất hoá đơn VAT thất bại')
    }
  }

  // useUpdateEffect(() => {
  //   if (!isFetchingVAT) {
  //     if (vatInfo?.data?.data && isSearch) {
  //       toggleSearchSuccess(true)
  //     }
  //   }
  // }, [isFetchingVAT])

  const handleSearch = () => {
    if (isSearch) return
    toggleSearch(true)
    refetch()
  }

  if (isExpired) return <ExpireInputVat />

  return (
    <div className="flex flex-col flex-1 text-pretty relative">
      <header className="p-3 flex justify-center items-center font-medium text-neutral-grey-600">
        Xuất hoá đơn VAT
      </header>
      <main className="flex-1 px-4 py-6">
        <FormProvider {...form}>
          <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <div className="flex flex-col gap-1 text-sm text-center">
              <div className="text-xl font-semibold">
                Kết thúc trong{' '}
                {booking?.bookingVatExpiredAt && appDayJs().isBefore(appDayJs(booking?.bookingVatExpiredAt)) && (
                  <Countdown
                    date={appDayJs(booking?.bookingVatExpiredAt).toDate()}
                    daysInHours
                    onComplete={() => setIsExpired(true)}
                  />
                )}
              </div>
              <div className="text-neutral-grey-400">
                Hoá đơn giá trị gia tăng được phát hành từ máy tính tiền. Vui lòng nhập thông tin để xuất hoá đơn.
              </div>
              {/* <div className="font-semibold text-yellow-600 cursor-pointer">Xem hoá đơn nháp</div> */}
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-md p-2 bg-[#F790091A] flex gap-2 items-center">
                <div className="flex-1">
                  <InfoIcon className="!w-6 !h-6 text-semantic-warning-300" />
                </div>
                <div className="text-xs text-neutral-grey-400">
                  Với các tổ chức, công đoàn, cơ quan nhà nước{' '}
                  <span className="font-semibold">không có Mã số thuế</span>, vui lòng nhập số 0 và điền các thông tin
                  còn lại bên dưới
                </div>
              </div>
              <Field
                ref={vatRef}
                name="taxCode"
                component="text"
                type="text"
                placeholder="Nhập mã số thuế"
                label="Mã số thuế"
                required
                addonAfter={
                  <Button
                    size="icon"
                    className="px-4"
                    type="button"
                    onClick={handleSearch}
                    loading={isFetchingVAT}
                    disabled={!isEnableSearch}
                  >
                    <ArrowsClockWiseIcon className="!size-6" />
                  </Button>
                }
              />
              {inputFields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                  <Field {...field} />
                  {field.note && <p className="text-xs text-neutral-grey-300">{field.note}</p>}
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <div className="py-3 flex items-center gap-2 text-sm text-neutral-grey-500">
                  <Checkbox
                    checked={isConfirm}
                    onCheckedChange={(checked) => toggleIsConfirm(checked as boolean)}
                    title="Xác nhận thông tin thanh toán"
                    id="confirm-vat-info"
                  />
                  <label htmlFor="confirm-vat-info" className="cursor-pointer">
                    Xác nhận thông tin thanh toán
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={isDisableInput || !isConfirm || isFetchingVAT}
                  loading={isLoadingUpdateBookingVatInfo}
                >
                  Xuất hoá đơn
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
      {isFetchingBooking && (
        <div className="flex-1 h-full w-full flex justify-center items-center bg-neutral-white/50 backdrop-blur-sm absolute top-0 left-0 z-9999">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  )
}

export default InputVat
