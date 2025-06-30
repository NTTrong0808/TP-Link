import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useServicePriceListById } from '@/lib/api/queries/service-price-list/get-all-service-price-by-id'
import { useDeleteService } from '@/lib/api/queries/service/delete-service'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  serviceId: string
  serviceShortTitle: string
}

const ModalConfirmDeleteService = ({ open, setOpen, serviceShortTitle, serviceId }: Props) => {
  const queryClient = useQueryClient()

  const { mutate: deleteService, isPending } = useDeleteService({
    onError() {
      toastError('Xoá dịch vụ thất bại')
    },
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: useServices.getKey() }),
        queryClient.invalidateQueries({
          queryKey: useServicePriceListById.getKey(),
        }),
      ])

      toastSuccess('Xoá dịch vụ thành công')
      setOpen(false)
    },
  })
  const methods = useForm()

  const handleSubmit = methods.handleSubmit((values) => {
    deleteService({
      serviceId,
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <span className="font-medium">Xoá dịch vụ</span>
            <p>
              Bạn có chắc rằng muốn xoá dịch vụ <b>{serviceShortTitle}</b> không? Hành động này sẽ xoá hoàn toàn các dữ
              liệu liên quan
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Rời trang
              </Button>
              <Button disabled={isPending} type="submit" variant="destructive">
                Xoá dịch vụ
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ModalConfirmDeleteService
