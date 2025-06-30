import { Button } from '@/components/ui/button'
import { LFC_URL } from '@/constants/urls'
import { memo } from 'react'

const SuccessDialog = ({ bookingCode = '' }: { bookingCode?: string }) => {
  return (
    <article role="dialog" className="flex flex-col gap-6 p-2">
      <section className="text-center">
        <h2 className="font-semibold text-xl text-neutral-black leading-8">Thông báo!</h2>
      </section>
      <div className="w-full text-center">
        Thông tin xuất VAT cho hoá đơn {bookingCode} đã được gửi.
        <br />
        Hoá đơn sẽ được gửi đến địa chỉ email của bạn.
      </div>
      <section className="flex">
        <Button
          onClick={() => {
            window.location.replace(LFC_URL ?? '')
          }}
          className="w-full"
        >
          Đóng
        </Button>
      </section>
    </article>
  )
}
SuccessDialog.displayName = 'SuccessDialog'

export default memo(SuccessDialog)
