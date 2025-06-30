import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { ILCScannerTerminal, ScannerTerminalStatus } from '@/lib/api/queries/scanner-terminal/schema'
import { useUpdateScanner } from '@/lib/api/queries/scanner-terminal/update-scanner'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const schema = z.object({
  ID: z.string({ message: 'Vui lòng điền ID Scanner' }),
  name: z.string({ message: 'Vui lòng điền tên Scanner' }),
  services: z.array(z.any()).optional(),
  status: z.string({ message: 'Vui lòng chọn trạng thái hoạt động' }),
})

export interface UpdateScannerTerminalProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  scannerData: ILCScannerTerminal
}
const statusOptions = [
  {
    value: ScannerTerminalStatus.ACTIVED,
    label: 'Đang hoạt động',
  },
  {
    value: ScannerTerminalStatus.INACTIVED,
    label: 'Ngừng hoạt động',
  },
  {
    value: ScannerTerminalStatus.MAINTENANCE,
    label: 'Bảo trì',
  },
]

const UpdateScannerTerminal = ({ onCompleted, onError, scannerData }: UpdateScannerTerminalProps) => {
  const { close } = useDialogContext()

  const { mutate: updateScanner, isPending } = useUpdateScanner({
    onSuccess() {
      toastSuccess('Chỉnh sửa Scanner thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError(error.response?.data.message || 'Chỉnh sửa Scanner thất bại')
      onError?.(error)
    },
  })

  const { data: serviceData } = useServices()

  const [serviceOptions, setServiceOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const [services, setServices] = useState<
    {
      serviceId: string
      serviceName: string
    }[]
  >(scannerData?.services ?? [])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...scannerData,
      services: scannerData?.services?.map((e) => ({
        value: e.serviceId,
        label: e.serviceName,
      })),
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (services.length === 0) {
      toast.error('Vui lòng chọn dịch vụ quét', { position: 'top-right' })
      return
    }
    updateScanner({
      id: scannerData?._id,
      dto: {
        ...data,
        services,
        status: data.status as ScannerTerminalStatus,
      },
    })
  })

  useEffect(() => {
    if (serviceData) {
      setServiceOptions(
        serviceData.map((service) => ({
          value: service._id,
          label: service.shortTitle.vi,
        })),
      )
    }
  }, [serviceData])
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Field
          className="col-span-1"
          component="text"
          name="ID"
          label="ID"
          placeholder="Nhập ID"
          disabled={isPending}
        />

        <Field
          className="col-span-1"
          component="text"
          name="name"
          label="Tên máy"
          placeholder="Nhập tên máy"
          disabled={isPending}
        />

        <Field
          className="col-span-2"
          component="multiselect"
          name="services"
          options={serviceOptions}
          label="Dịch vụ quét"
          placeholder="Lựa chọn dịch vụ quét"
          disabled={isPending}
          onChange={(data) => {
            setServices(
              data?.map((e) => ({
                serviceId: e.value,
                serviceName: e.label,
              })),
            )
          }}
        />
        <Field
          className="col-span-2"
          component="select"
          name="status"
          options={statusOptions}
          label="Trạng thái"
          placeholder="Lựa chọn trạng thái"
          disabled={isPending}
        />

        <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
          <Button type="button" variant="outline" className="col-span-1" size="lg" disabled={isPending} onClick={close}>
            Huỷ
          </Button>
          <Button type="submit" className="col-span-1" size="lg" disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Lưu Scanner'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default UpdateScannerTerminal
