import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toastError } from '@/components/widgets/toast'
import { getCellValue } from '@/utils/get-cell-value'
import { useQueryClient } from '@tanstack/react-query'
import ExcelJS from 'exceljs'
import { UploadIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { templateUtils } from './utils'
import { IImportProductVariantDto } from '@/lib/api/queries/product-variant/type'
import { useImportProductVariants } from '@/lib/api/queries/product-variant/import-product-variants'
import { toast } from 'sonner'
import { useGetProductVariants } from '@/lib/api/queries/product-variant/get-product-variants'

type Props = {}

const ImportExcelProductVariants = ({}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function isRowEmpty(row: ExcelJS.Row): boolean {
    return (row.values as any)
      .slice(1)
      .every((v: any) => !v || (typeof v === 'string' ? v.trim() === '' : v.toString().trim() === ''))
  }

  const { mutateAsync: importProductVariants } = useImportProductVariants({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: useGetProductVariants.getKey(),
      })
    },
  })

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

      const headerRow = worksheet.getRow(1)
      const isValid = templateUtils.validateTemplateHeader(headerRow)
      if (!isValid) return

      const headerMap: Record<string, number> = {}

      headerRow.eachCell((cell, colNumber) => {
        const name = cell?.value?.toString()?.trim()
        if (name) {
          headerMap[name] = colNumber
        }
      })

      const productVariants: IImportProductVariantDto[] = []
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber)
        if (isRowEmpty(row)) continue

        const values = row.values as any[]

        const product: IImportProductVariantDto = {
          variantCode: values[headerMap['Mã']]?.toString()?.trim() || '',
          name: values[headerMap['Tên sản phẩm']]?.toString()?.trim() || '',
          status: values[headerMap['Tình trạng']]?.toString()?.trim() || '',
          barcode: values[headerMap['Mã vạch']]?.toString()?.trim() || '',
          localPrice: parseFloat(values[headerMap['Giá ĐL']]) || 0,
          nationalPrice: parseFloat(values[headerMap['Giá TQ']]) || 0,
          boxSpecification: values[headerMap['QC thùng']]?.toString()?.trim() || '',
          unitName: values[headerMap['ĐVT']]?.toString()?.trim() || '',
          expirationDate: values[headerMap['HSD']]?.toString()?.trim() || '',
          expirationUnit: values[headerMap['ĐVT HSD']]?.toString()?.trim() || '',
          collectionId: values[headerMap['Nhóm sản phẩm']]?.toString()?.trim() || '',
          categoryId: values[headerMap['Loại sản phẩm']]?.toString()?.trim() || '',
          brandId: values[headerMap['Thương hiệu']]?.toString()?.trim() || '',
          vatIn: parseFloat(values[headerMap['VAT in']]) || 0,
          vatOut: parseFloat(values[headerMap['VAT out']]) || 0,
          saleGroup: values[headerMap['Nhóm doanh số (POS Eshop)']]?.toString()?.trim() || '',
        }

        productVariants.push(product)
      }

      const chunkSize = 100

      for (let i = 0; i < productVariants.length; i += chunkSize) {
        const chunk = productVariants.slice(i, i + chunkSize)

        await importProductVariants({ productVariants: chunk })
      }

      toast.success('Tải danh sách sản phẩm thành công', { position: 'top-right' })
      setOpen(false)
    } catch (error) {
      toast.error('Tải danh sách sản phẩm thất bại', { position: 'top-right' })
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
          Tải danh sách sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-medium flex items-center gap-1">
          Tải danh sách sản phẩm
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

export default ImportExcelProductVariants
