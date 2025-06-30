import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toastSuccess } from '@/components/widgets/toast'
import { useCustomersPagination } from '@/lib/api/queries/customer/get-customers-pagination'
import { useUpdateCustomer } from '@/lib/api/queries/customer/update-customer'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  customerId: string
  name: string
}

const ModalConfirmDisableCustomer = ({ open, setOpen, customerId, name }: Props) => {
  const queryClient = useQueryClient()

  const { mutate: updateCustomer, isPending } = useUpdateCustomer({
    onError() {},
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: useCustomersPagination.getKey(),
      })
      toastSuccess('Huỷ kích hoạt khách hàng thành công')
      setOpen(false)
    },
  })
  const methods = useForm()

  const handleSubmit = methods.handleSubmit((values) => {
    updateCustomer({
      id: customerId,
      dto: {
        isActive: false,
      },
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <span className="font-medium">Tạm dừng hoạt động</span>
            <p>
              Bạn có chắc rằng muốn huỷ kích hoạt với TA <b>{name}</b> không?
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

export default ModalConfirmDisableCustomer
