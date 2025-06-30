import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useDeleteServicePriceList } from '@/lib/api/queries/service-price-list/delete-service-price-list'
import { useServicePriceList } from '@/lib/api/queries/service-price-list/get-all-service-price-list'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  servicePriceListId: string
  servicePriceListTitle: string
}

const ModalConfirmDeleteServicePriceList = ({ open, setOpen, servicePriceListTitle, servicePriceListId }: Props) => {
  const queryClient = useQueryClient()

  const { mutate: deleteServicePriceList, isPending } = useDeleteServicePriceList({
    onError() {
      toastError('Xoá bảng giá dịch vụ thất bại')
    },
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: useServicePriceList.getKey(),
        }),
      ])

      toastSuccess('Xoá bảng giá dịch vụ thành công')
      setOpen(false)
    },
  })
  const methods = useForm()

  const handleSubmit = methods.handleSubmit((values) => {
    deleteServicePriceList({
      servicePriceListId,
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <span className="font-medium">Xoá bảng giá dịch vụ </span>
            <p>
              Bạn có chắc rằng muốn xoá Bảng giá dịch vụ <b>{servicePriceListTitle}</b> không? Hành động này sẽ xoá hoàn
              toàn các dữ liệu liên quan
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Rời trang
              </Button>
              <Button disabled={isPending} type="submit" variant="destructive">
                Xoá bảng giá
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ModalConfirmDeleteServicePriceList
