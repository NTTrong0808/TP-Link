import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import SuccessError from '@/assets/images/success.png'
import Image from 'next/image'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SuccessDialog = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Image src={SuccessError} width={60} height={60} alt="error" className="mx-auto mt-4" />
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tải lên thành công</h2>
          <span className="text-sm text-neutral-grey-400">Tất cả thông tin đã được cập nhật</span>
        </div>
        <Button onClick={() => setOpen(false)} variant="outline" type="button">
          Đóng
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessDialog
