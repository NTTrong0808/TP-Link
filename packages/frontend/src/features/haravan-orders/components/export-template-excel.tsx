import { Button } from '@/components/ui/button'
import { appDayJs } from '@/utils/dayjs'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const ExportTemplateExcelVAT = async () => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Template')

  worksheet.columns = [
    { header: 'Mã đơn hàng', key: 'order_code', width: 20, style: { numFmt: '@' } },
    { header: 'Mã số thuế', key: 'tax_code', width: 20, style: { numFmt: '@' } },
    { header: 'Email nhận hóa đơn', key: 'email', width: 30, style: { numFmt: '@' } },
  ]

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, `${appDayJs().format('YYMMDD HH.mm')}_Mẫu file nhập VAT.xlsx`)
}

const ExportTemplateExcel = () => {
  return (
    <span className="text-center text-sm">
      Tải về file mẫu:{' '}
      <b onClick={ExportTemplateExcelVAT} className="text-medium text-semantic-info-400 hover:cursor-pointer">
        mẫu file cập nhật thông tin VAT
      </b>
    </span>
  )
}

export default ExportTemplateExcel
