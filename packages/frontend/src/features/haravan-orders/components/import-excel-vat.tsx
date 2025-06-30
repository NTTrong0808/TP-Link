import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toastError } from '@/components/widgets/toast'
import { useBulkUpdateOrderVAT } from '@/lib/api/queries/haravan-orders/bulk-update-order-vat'
import { useMutateOrderDetailByOrderNumber } from '@/lib/api/queries/haravan-orders/get-order-detail-by-order-number'
import { useGetOrders } from '@/lib/api/queries/haravan-orders/get-orders'
import { useMutateGetVatInfo } from '@/lib/api/queries/viet-qr/get-vat-info'
import { delay } from '@/utils/delay'
import { getCellValue } from '@/utils/get-cell-value'
import { withTimeout } from '@/utils/with-timeout'
import { useQueryClient } from '@tanstack/react-query'
import ExcelJS from 'exceljs'
import { UploadIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import ExportTemplateExcel from './export-template-excel'
import { templateUtils } from './utils'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const taxCodeRegex = /^\d{10}(-\d{3}|\d{4})?$/

type Props = {
  onError: (
    errors: {
      rowNumber: number
      rowData: {
        orderNumber: string
        taxCode: string
        email: string
      }
      errors: string[]
    }[],
  ) => void

  onSuccess: () => void
}

const ImportExcelVAT = ({ onError, onSuccess }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { mutateAsync: updateOrderVATs } = useBulkUpdateOrderVAT()
  const { mutateAsync: getVATInfo } = useMutateGetVatInfo()
  const { mutateAsync: getOrderDetail } = useMutateOrderDetailByOrderNumber()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      if (!file) {
        toastError('Vui lòng chọn File excel để nhập')
        return
      }

      const workbook = new ExcelJS.Workbook()
      const buffer = await file.arrayBuffer()
      await workbook.xlsx.load(buffer)

      const worksheet = workbook.getWorksheet('Template') || workbook.worksheets[0]

      const result: any[] = []
      const errorRows: {
        rowNumber: number
        rowData: {
          orderNumber: string
          taxCode: string
          email: string
        }
        errors: string[]
      }[] = []
      const headerRow = worksheet.getRow(1)
      const isValid = templateUtils.validateTemplateHeader(headerRow)
      if (!isValid) return
      const vats: {
        taxCode: string
        address: string
        legalName: string
      }[] = []

      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber)
        const values = row.values as any[]

        const rowData = {
          orderNumber: getCellValue(values[1]),
          taxCode: getCellValue(values[2]),
          email: getCellValue(values[3]),
        }

        if (!rowData.orderNumber && !rowData.taxCode && !rowData.email) {
          continue
        }

        const rowErrors: string[] = []
        if (!rowData.orderNumber) {
          rowErrors.push('orderNumber')
        } else {
          const orderDetail = await getOrderDetail({
            orderNumber: rowData.orderNumber,
          })
          if (!orderDetail?.data) {
            rowErrors.push('orderNumber')
          }
        }

        if (!rowData.taxCode || !taxCodeRegex.test(rowData.taxCode)) {
          rowErrors.push('taxCode')
        } else {
          let vat: any = null
          let success = false
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              vat = await withTimeout(getVATInfo({ taxCode: rowData.taxCode }), 1000)
              if (vat?.data?.code === '00') {
                success = true
                break
              }
              await delay(1000)
            } catch {
              // Ignore error; retry
            }
          }

          if (success) {
            vats.push({
              taxCode: rowData.taxCode,
              address: vat?.data?.data?.address,
              legalName: vat?.data?.data?.name,
            })
          } else {
            rowErrors.push('taxCode')
          }
        }

        if (rowData.email && !emailRegex.test(rowData.email)) {
          rowErrors.push('email')
        }

        if (rowErrors.length > 0) {
          errorRows.push({ rowNumber, rowData, errors: rowErrors })
        } else {
          result.push(rowData)
        }

        await delay(400)
      }

      if (errorRows.length > 0) {
        setOpen(false)
        onError(errorRows)
      } else {
        try {
          const data = result.map((e) => {
            const vat = vats.find((vat) => e.taxCode === vat.taxCode)
            return {
              orderNumber: e.orderNumber,
              address: vat?.address ?? '',
              legalName: vat?.legalName ?? '',
              receiverEmail: e.email,
              taxCode: e.taxCode,
            }
          })

          await updateOrderVATs({ vatDatas: data })
          await queryClient.invalidateQueries({ queryKey: useGetOrders.getKey() })

          setOpen(false)
          onSuccess()
        } catch (error: any) {
          toastError(error?.response?.data?.message ?? 'Có lỗi xảy ra vui lòng thử lại sau')
        }
      }
    } catch (error) {
      toastError('Đã xảy ra lỗi khi xử lý file.')
    } finally {
      setIsLoading(false)
      setFile(undefined)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const fileName = selectedFile.name.toLowerCase()
    if (!fileName.endsWith('.xlsx')) {
      toastError('Chỉ chấp nhận file Excel định dạng .xlsx')
      if (inputRef.current) inputRef.current.value = ''
      setFile(undefined)
      return
    }

    setFile(selectedFile)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="!bg-primary-orange-400" size="lg">
          <UploadIcon />
          Tải thông tin hóa đơn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-medium flex items-center gap-1">
          Cập nhật thông tin VAT từ file
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_14711_9514)">
                  <path
                    d="M6.05967 6.00016C6.21641 5.55461 6.52578 5.1789 6.93298 4.93958C7.34018 4.70027 7.81894 4.61279 8.28446 4.69264C8.74998 4.77249 9.17222 5.01451 9.47639 5.37585C9.78057 5.73718 9.94705 6.19451 9.94634 6.66683C9.94634 8.00016 7.94634 8.66683 7.94634 8.66683M7.99967 11.3335H8.00634M14.6663 8.00016C14.6663 11.6821 11.6816 14.6668 7.99967 14.6668C4.31778 14.6668 1.33301 11.6821 1.33301 8.00016C1.33301 4.31826 4.31778 1.3335 7.99967 1.3335C11.6816 1.3335 14.6663 4.31826 14.6663 8.00016Z"
                    stroke="#616161"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14711_9514">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </TooltipTrigger>
            <TooltipContent>
              <ul className="">
                <li>+ Chỉ hỗ trợ upload file excel có định dạng .xlsx</li>
                <li>
                  + File excel yêu cầu đúng tên cột và thứ tự của cột: Mã đơn hàng, Mã số thuế, Email nhận hóa đơn
                </li>
                <li>+ Thông tin trong cột &quot;Email nhận hóa đơn&quot; có thể để trống</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </h2>
        <div className="flex flex-col items-center justify-center py-4">
          <Button onClick={() => inputRef?.current?.click()} className="bg-primary-orange-400 w-fit">
            <UploadIcon className="size-4" />
            Chọn file dữ liệu
          </Button>
          {file && (
            <span className="text-sm mt-4">
              Đã tải file: <b className="text-semantic-info-400">{file?.name}</b>
            </span>
          )}
        </div>
        <input type="file" accept=".xlsx" ref={inputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        <ExportTemplateExcel />
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => setOpen(false)} variant="outline" type="button">
            Hủy
          </Button>
          <Button type="submit" className="bg-primary-orange-400" onClick={handleSubmit} isLoading={isLoading}>
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImportExcelVAT
