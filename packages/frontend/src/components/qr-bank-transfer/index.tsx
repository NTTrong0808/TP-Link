import { cn } from '@/lib/tw'
import Image, { ImageProps } from 'next/image'

interface QRBankTranferProps extends Omit<ImageProps, 'src' | 'alt'> {
  width?: number
  height?: number
  accountNumber?: string
  bankCode?: string
  amount?: number
  template?: 'qronly' | 'compact'
  note?: string
}
const QRBankTranfer = ({
  width = 160,
  height = 160,
  accountNumber,
  bankCode,
  amount,
  note = '',
  template = 'qronly',
  ...props
}: QRBankTranferProps) => {
  const qrSrc =
    bankCode && accountNumber && amount
      ? `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bankCode}&amount=${amount}&template=${template}&des=${note}`
      : 'https://www.discountflooringsupplies.com.au/wp-content/uploads/blank-img.jpg'

  return (
    <div
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
      }}
    >
      {bankCode && accountNumber && amount && (
        <img
          src={qrSrc}
          width={width}
          height={height}
          crossOrigin="anonymous"
          alt="qr-bank-transfer"
          className={cn('w-full h-full object-contain', props.className)}
        />
      )}
    </div>
  )
}

export default QRBankTranfer
