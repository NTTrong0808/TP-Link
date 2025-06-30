import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, ImportIcon, UploadIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ErrorImage from '@/assets/images/error.png'
import Image from 'next/image'
import { cn } from '@/lib/tw'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { appDayJs } from '@/utils/dayjs'

type Props = {
  errorRows: {
    rowNumber: number
    rowData: {
      orderNumber: string
      taxCode: string
      email: string
    }
    errors: string[]
  }[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const ErrorsDialog = ({ open, setOpen, errorRows }: Props) => {
  const downloadErrorExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Lỗi tải lên')

    worksheet.columns = [
      { header: 'Dòng', key: 'rowNumber', width: 10 },
      { header: 'Mã đơn hàng', key: 'orderNumber', width: 20 },
      { header: 'Mã số thuế', key: 'taxCode', width: 20 },
      { header: 'Email nhận hóa đơn', key: 'email', width: 30 },
      { header: 'Lỗi', key: 'errors', width: 50 },
    ]

    errorRows.forEach((row) => {
      worksheet.addRow({
        rowNumber: row.rowNumber,
        orderNumber: row.rowData.orderNumber,
        taxCode: row.rowData.taxCode,
        email: row.rowData.email,
        errors: row.errors
          ?.map((error) => {
            if (error === 'taxCode') {
              return 'Mã số thuế không tồn tại'
            }
            if (error === 'orderNumber') {
              return 'Mã đơn hàng không tồn tại'
            }
            if (error === 'email') {
              return 'Email không hợp lệ'
            }
            return ''
          })
          .join(', '),
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `${appDayJs().format('DDMMYY_HHmm')}_Các lỗi trong file import VAT.xlsx`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Image src={ErrorImage} width={60} height={60} alt="error" className="mx-auto mt-4" />
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tải lên có lỗi!</h2>
          <span className="text-sm text-neutral-grey-400">Một số thông tin không hợp lệ. Vui lòng kiểm tra lại.</span>
        </div>

        <div className="w-full px-4 py-2 rounded-lg bg-[#F5F5F5] text-xs flex flex-col">
          <div className="grid grid-cols-12 gap-4 pb-2">
            <div className="col-span-2">
              <b>Dòng</b>
            </div>
            <div className="col-span-3">
              <b>Mã đơn hàng</b>
            </div>
            <div className="col-span-3">
              <b>MST</b>
            </div>
            <div className="col-span-4">
              <b>Email</b>
            </div>
          </div>
          <div className="w-full flex flex-col max-h-[300px] overflow-auto">
            {errorRows.map((row) => (
              <div
                key={`row-${row.rowNumber}`}
                className="grid grid-cols-12 gap-4 border-t-[1px] border-neutral-grey-100 py-2"
              >
                <div className="col-span-2">{row.rowNumber}</div>
                <div
                  className={cn(
                    'col-span-3 flex items-center flex-row gap-2 line-clamp-1 truncate',
                    row.errors.includes('orderNumber') && 'text-[#F79009]',
                  )}
                >
                  {row.rowData.orderNumber}
                </div>
                <div
                  className={cn(
                    'col-span-3 flex items-center flex-row gap-2 line-clamp-1 truncate',
                    row.errors.includes('taxCode') && 'text-[#F79009]',
                  )}
                >
                  {row.rowData.taxCode}
                </div>
                <div
                  className={cn(
                    'col-span-3 flex items-center gap-2 line-clamp-1 truncate',
                    row.errors.includes('email') && 'text-[#F79009]',
                  )}
                >
                  {row.rowData.email}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={downloadErrorExcel} variant="outline">
          <DownloadIcon /> Tải file chứa thông tin không hợp lệ
        </Button>
        <div className="flex flex-col gap-2 px-4 py-4 rounded-lg bg-[#F5F5F5]">
          <h2 className="flex items-center gap-1 text-sm font-semibold text-[#616161]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g clipPath="url(#clip0_14650_59098)">
                <path
                  d="M6.05967 6.00016C6.21641 5.55461 6.52578 5.1789 6.93298 4.93958C7.34018 4.70027 7.81894 4.61279 8.28446 4.69264C8.74998 4.77249 9.17222 5.01451 9.47639 5.37585C9.78057 5.73718 9.94705 6.19451 9.94634 6.66683C9.94634 8.00016 7.94634 8.66683 7.94634 8.66683M7.99967 11.3335H8.00634M14.6663 8.00016C14.6663 11.6821 11.6816 14.6668 7.99967 14.6668C4.31778 14.6668 1.33301 11.6821 1.33301 8.00016C1.33301 4.31826 4.31778 1.3335 7.99967 1.3335C11.6816 1.3335 14.6663 4.31826 14.6663 8.00016Z"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_14650_59098">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Hướng dẫn
          </h2>
          <p className="flex flex-col text-xs text-[#616161]">
            <span>
              <b>Mã đơn hàng:</b> Mã đơn không tồn tại, vui lòng kiểm tra lại.
            </span>
            <span>
              <b>Mã số thuế:</b> Đảm bảo MST có đúng 10 hoặc 14 chữ số.
            </span>
            <span>
              <b>Email hóa đơn:</b> Đảm bảo email đúng định dạng. Ví dụ: email@domain.com (không để trống hoặc thiếu @,
              tên miền).
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => setOpen(false)} variant="outline" type="button">
            Hủy
          </Button>
          <Button type="button" onClick={() => setOpen(false)} className="bg-primary-orange-400">
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ErrorsDialog
