import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { ILCPosTerminal, PosTerminalStatus } from '@/lib/api/queries/pos-terminal/schema'
import { useUpdatePos } from '@/lib/api/queries/pos-terminal/update-pos'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schema = z.object({
  ID: z.string({ message: 'Vui lòng điền ID POS' }),
  name: z.string({ message: 'Vui lòng điền tên POS' }),
  location: z.string({ message: 'Vui lòng điền địa điểm hoạt động' }),
  status: z.string({ message: 'Vui lòng chọn trạng thái hoạt động' }),
  posCode: z.string({ message: 'Vui lòng nhập thiết bị thanh toán' }),
  otherDevices: z.array(z.any()).optional(),
})

export interface UpdatePosTerminalProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  posData: ILCPosTerminal
}
const statusOptions = [
  {
    value: PosTerminalStatus.ACTIVED,
    label: 'Đang hoạt động',
  },
  {
    value: PosTerminalStatus.INACTIVED,
    label: 'Ngưng hoạt động',
  },
  {
    value: PosTerminalStatus.MAINTENANCE,
    label: 'Bảo trì',
  },
]

const peripheralOptions = [
  { label: 'Máy in hóa đơn', value: 'Máy in hóa đơn' },
  { label: 'Máy quét mã vạch', value: 'Máy quét mã vạch' },
  { label: 'Máy POS thanh toán', value: 'Máy POS thanh toán' },
  { label: 'Máy kiểm soát vé', value: 'Máy kiểm soát vé' },
  {
    label: 'Màn hình hiển thị khách hàng',
    value: 'Màn hình hiển thị khách hàng',
  },
]

const UpdatePosTerminal = ({ onCompleted, onError, posData }: UpdatePosTerminalProps) => {
  const { close } = useDialogContext()

  const { mutate: updatePos, isPending } = useUpdatePos({
    onSuccess() {
      toastSuccess('Chỉnh sửa POS thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError(error.response?.data.message || 'Chỉnh sửa POS thất bại')
      onError?.(error)
    },
  })

  const [otherDevices, setOtherDevices] = useState<string[]>(posData?.otherDevices ?? [])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...posData,
      otherDevices: posData?.otherDevices?.map((e) => ({ label: e, value: e })) ?? [],
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    updatePos({
      id: posData?._id,
      dto: {
        ...data,
        status: data.status as PosTerminalStatus,
        otherDevices,
      },
    })
  })

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
          component="text"
          name="location"
          label="Địa điểm hoạt động"
          placeholder="Nhập địa điểm hoạt động"
          disabled={isPending}
        />

        <Field
          className="col-span-2"
          component="text"
          name="posCode"
          label="Thiết bị thanh toán"
          placeholder="Nhập thiết bị thanh toán"
          disabled={isPending}
        />
        <Field
          className="col-span-2"
          component="multiselect"
          name="otherDevices"
          options={peripheralOptions}
          label="Thiết bị ngoại vi"
          placeholder="Lựa chọn thiết bị ngoại vi"
          disabled={isPending}
          onChange={(data) => {
            setOtherDevices(data?.map((e) => e?.label))
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
            {isPending ? 'Đang lưu...' : 'Lưu POS'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default UpdatePosTerminal
