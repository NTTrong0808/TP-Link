'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/form'
import EditIcon from '@/components/widgets/icons/edit-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useUpdateBookingNote } from '@/lib/api/queries/booking/update-booking-note'
import { useOrderDetail } from '@/lib/api/queries/order/get-order-detail'
import { cn } from '@/lib/tw'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export interface NoteProps {
  bookingId: string
  defaultValue?: string
}
const BookingNote = ({ bookingId, defaultValue }: NoteProps) => {
  const form = useForm({
    defaultValues: {
      note: defaultValue,
    },
  })
  const [open, setOpen] = useState<boolean>(false)
  const toggle = (_open: boolean) => setOpen(_open)
  const queryClient = useQueryClient()
  const { mutate: updateBooking, isPending } = useUpdateBookingNote({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: useOrderDetail.getKey(),
      })
      setOpen(false)
      toastSuccess('Thêm ghi chú thành công')
    },
    onError() {
      toastError('Thêm ghi chú thất bại!')
    },
  })
  const handleSubmit = form.handleSubmit(async (values) => {
    updateBooking({
      bookingId,
      note: values?.note ?? undefined,
    })
  })

  useEffect(() => {
    form.reset({ note: defaultValue ?? '' })
  }, [defaultValue])
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        toggle(open)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <EditIcon className="size-5" />
      </DialogTrigger>
      <DialogContent
        hideCloseButton
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className={cn('max-w-[600px] [&>*_label]:text-xs [&>*_label]:text-neutral-grey-500 p-4')}
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogTitle>
              <span className="font-medium text-lg">Thêm ghi chú</span>
            </DialogTitle>
            <Field component="textarea" placeholder="Nhập ghi chú" name="note" maxLength={200} />
            <div className="flex flex-col gap-6">
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    toggle(false)
                  }}
                  className="flex-1"
                  type="button"
                >
                  Hủy
                </Button>
                <Button className="flex-1" isLoading={isPending}>
                  Thêm
                </Button>
              </DialogFooter>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default BookingNote
