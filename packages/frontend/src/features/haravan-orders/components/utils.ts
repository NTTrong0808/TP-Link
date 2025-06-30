import { toastError } from '@/components/widgets/toast'
import ExcelJS from 'exceljs'

class TemplateUtils {
  productVariantsTemplateColumns = 3
  errorMessage = {
    INVALID_FORMAT: 'Nội dung không đúng định dạng',
    INVALID_COLUMN_NAME: 'Tên cột không chính xác',
  }

  productTemplateKeysWithColumns = ['Mã đơn hàng', 'Mã số thuế', 'Email nhận hóa đơn']

  validateTemplateHeader(headerRow: ExcelJS.Row) {
    let isValid = true
    if (headerRow.actualCellCount !== this.productVariantsTemplateColumns) {
      toastError(this.errorMessage.INVALID_FORMAT)
      isValid = false
      return isValid
    }

    headerRow.eachCell((cell, colNumber) => {
      if (this.productTemplateKeysWithColumns?.[colNumber - 1] !== (cell?.value?.toString()?.trim() as never)) {
        toastError(this.errorMessage.INVALID_COLUMN_NAME)
        isValid = false
        return isValid
      }
    })

    return isValid
  }
}

export const templateUtils = new TemplateUtils()
