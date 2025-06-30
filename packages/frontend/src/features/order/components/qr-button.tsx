'use client'

import qrImage from '@/assets/images/QR.png'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DownloadIcon } from 'lucide-react'
import QRBankTranfer from '@/components/qr-bank-transfer'
import { DialogTitle } from '@radix-ui/react-dialog'
import { appDayJs } from '@/utils/dayjs'

type Props = {
  accountNumber: string
  bankCode: string
  amount: number
  note: string
  accountName: string
}

const QRButton = ({ accountNumber, bankCode, amount, note, accountName }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const qrContainerRef = useRef<HTMLDivElement>(null)

  const downloadSvgQRCode = (format: 'png' | 'jpeg') => {
    if (qrContainerRef.current) {
      // Delay nhỏ để đảm bảo QR đã render đầy đủ
      setTimeout(() => {
        html2canvas(qrContainerRef.current!, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
        }).then((canvas) => {
          const link = document.createElement('a')
          link.href = canvas.toDataURL(`image/${format}`)
          link.download = `QR_${note}_${appDayJs().format('DDMMYY_HHmm')}.${format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      }, 100) // 100ms
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="bg-white">
          <Image height={20} width={20} src={qrImage} alt="QR" className="h-[20px] w-auto" />
          QR code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Mã QR thanh toán</DialogTitle>
        <div
          ref={qrContainerRef}
          className="flex items-center flex-col justify-center gap-1 mx-auto w-full max-w-[478px]"
          id="QRCode"
        >
          <QRBankTranfer
            accountNumber={accountNumber}
            bankCode={bankCode}
            amount={amount}
            note={note}
            width={460}
            height={460}
          />
          <span className="text-sm">{note}</span>
          <span className="text-sm">{accountName}</span>
          <span className="text-sm">
            {bankCode} - {accountNumber}
          </span>
          <div className="h-3" />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <Button onClick={() => downloadSvgQRCode('png')} variant="outline">
            <DownloadIcon className="size-6" />
            Tải xuống PNG
          </Button>
          <Button onClick={() => downloadSvgQRCode('jpeg')} variant="outline">
            <DownloadIcon className="size-6" />
            Tải xuống JPEG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QRButton
