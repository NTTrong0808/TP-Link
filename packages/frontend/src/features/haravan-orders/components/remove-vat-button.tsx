import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useGetOrders } from '@/lib/api/queries/haravan-orders/get-orders'
import { useRemoveOrderVat } from '@/lib/api/queries/haravan-orders/remove-order-vat'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

type Props = {
  orderId: string
}
const RemoveVATButton = ({ orderId }: Props) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)

  const { mutate: removeOrderVAT, isPending: isPendingRemove } = useRemoveOrderVat({
    onSuccess() {
      toastSuccess('Xóa thông tin VAT thành công')
      queryClient.invalidateQueries({ queryKey: useGetOrders.getKey() })
      setOpen(false)
    },
    onError() {
      toastError('Xóa thông tin VAT thất bại')
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TrashIcon className="text-primary-orange-400" />
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-medium">Xóa thông tin xuất hóa đơn</h2>
        <div className="flex items-end gap-4">Bạn có chắc muốn xóa thông tin này không?</div>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => setOpen(false)} variant="outline" type="button">
            Hủy
          </Button>
          <Button
            type="submit"
            isLoading={isPendingRemove}
            onClick={() =>
              removeOrderVAT({
                id: orderId,
              })
            }
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RemoveVATButton
