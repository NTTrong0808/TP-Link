import { toastError } from '@/components/widgets/toast'
import ExcelJS from 'exceljs'

class TemplateUtils {
  errorMessage = {
    INVALID_FORMAT: 'Nội dung không đúng định dạng',
    INVALID_COLUMN_NAME: 'Tên cột không chính xác',
  }

  productTemplateKeysWithColumns = [
    'Mã',
    'Tên sản phẩm',
    'Tình trạng',
    'Mã vạch',
    'Giá ĐL',
    'Giá TQ',
    'QC thùng',
    'ĐVT',
    'HSD',
    'ĐVT HSD',
    'Nhóm sản phẩm',
    'Loại sản phẩm',
    'Thương hiệu',
    'VAT in',
    'VAT out',
    'Nhóm doanh số (POS Eshop)',
  ]

  validateTemplateHeader(headerRow: ExcelJS.Row): boolean {
    const rawValues = headerRow.values

    if (!rawValues || !Array.isArray(rawValues)) {
      toastError(this.errorMessage.INVALID_FORMAT)
      return false
    }

    const headerValues = rawValues
      .slice(1) // Bỏ phần tử đầu vì thường là undefined
      .map((v) => v?.toString()?.trim())

    const missingColumns = this.productTemplateKeysWithColumns.filter((col) => !headerValues.includes(col))

    if (missingColumns.length > 0) {
      toastError(`${this.errorMessage.INVALID_COLUMN_NAME}: thiếu các cột ${missingColumns.join(', ')}`)
      return false
    }

    return true
  }
}

export const templateUtils = new TemplateUtils()
