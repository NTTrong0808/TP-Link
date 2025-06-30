import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toastSuccess } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import { useDeleteCustomer } from '@/lib/api/queries/customer/delete-customer'
import { useCustomers } from '@/lib/api/queries/customer/get-customers'
import { useQueryClient } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  customerId: string
  name: string
}

const ModalDeleteDisableCustomer = ({ open, setOpen, customerId, name }: Props) => {
  const queryClient = useQueryClient()

  const { mutate: deleteCustomer, isPending } = useDeleteCustomer({
    onError() {},
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: useCustomers.getKey() })
      toastSuccess('Xoá khách hàng thành công')
      setOpen(false)
      redirect(URLS.ADMIN.CUSTOMER.INDEX)
    },
  })
  const methods = useForm()

  const handleSubmit = methods.handleSubmit((values) => {
    deleteCustomer({
      id: customerId,
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <span className="font-medium">Xoá TA</span>
            <p>
              Bạn có chắc rằng muốn xoá TA <b>{name}</b> không?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Rời trang
              </Button>
              <Button disabled={isPending} type="submit" variant="destructive">
                Xoá TA
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDeleteDisableCustomer
