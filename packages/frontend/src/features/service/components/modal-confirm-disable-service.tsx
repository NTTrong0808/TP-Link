import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useDisableOrEnableService } from '@/lib/api/queries/service/disable-or-enable-service'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  serviceId: string
  serviceShortTitle: string
}

const ModalConfirmDisableService = ({ open, setOpen, serviceShortTitle, serviceId }: Props) => {
  const queryClient = useQueryClient()

  const { mutate: disableOrEnableService, isPending } = useDisableOrEnableService({
    onError() {
      toastError('Huỷ kích hoạt dịch vụ thất bại')
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: useServices.getKey() })
      toastSuccess('Huỷ kích hoạt dịch vụ thành công')
      setOpen(false)
    },
  })
  const methods = useForm()

  const handleSubmit = methods.handleSubmit((values) => {
    disableOrEnableService({
      serviceId,
      isActive: false,
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <span className="font-medium">Huỷ kích hoạt dịch vụ</span>
            <p>
              Bạn có chắc rằng muốn tạm thời huỷ kích hoạt với dịch vụ <b>{serviceShortTitle}</b> không?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Rời trang
              </Button>
              <Button disabled={isPending} type="submit" variant="destructive">
                Huỷ kích hoạt
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ModalConfirmDisableService
