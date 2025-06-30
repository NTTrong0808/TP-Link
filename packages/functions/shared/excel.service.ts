import * as Excel from 'exceljs';
import { appDayJs } from './dayjs';

export interface CurrentUserPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Add other user properties as needed
}

export interface ExcelHeader<T> {
  title: string;
  key: string;
  render?: (value: T) => string;
  isFormatCurrency?: boolean;
}

export interface ExcelFilter {
  title: string;
  value: string;
}

export class ExcelService {
  public async exportReport<T>({
    title,
    filters,
    headers,
    data,
    currentUser,
  }: {
    currentUser?: CurrentUserPayload;
    title: string;
    filters: { title: string; value: string }[];
    headers: {
      title: string;
      key: string;
      render?: (value: T) => string | number;
      isFormatCurrency?: boolean;
    }[];
    data: T[];
  }): Promise<Excel.Buffer> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(title);

    const defaultFont = { name: 'Times New Roman', size: 12 };

    // Người xuất & thời gian
    worksheet.getCell('A1').value = 'Người xuất';
    worksheet.getCell('B1').value =
      `${currentUser?.lastName || ''} ${currentUser?.firstName || ''}`;
    worksheet.getCell('A1').font = defaultFont;
    worksheet.getCell('B1').font = defaultFont;

    worksheet.getCell('A2').value = 'Ngày xuất';
    worksheet.getCell('B2').value = appDayJs().format('DD/MM/YYYY HH:mm');
    worksheet.getCell('A2').font = defaultFont;
    worksheet.getCell('B2').font = defaultFont;

    // Tiêu đề báo cáo
    const lastColumn = worksheet
      .getRow(4)
      .getCell(headers.length)
      .address.replace(/\d+/, '');
    worksheet.mergeCells(`A4:${lastColumn}4`);
    const titleCell = worksheet.getCell('A4');
    titleCell.value = title;
    titleCell.font = { name: 'Times New Roman', bold: true, size: 16 };
    titleCell.alignment = { vertical: 'middle' };

    // Ghi filters
    filters.forEach((f, index) => {
      const cell = worksheet.getCell(`A${6 + index}`);
      cell.value = `${f.title}: ${f.value}`;
      cell.font = defaultFont;
    });

    const dataStartRow = 6 + filters.length + 1;

    // Header
    const headerRow = worksheet.getRow(dataStartRow);
    headerRow.values = headers.map((h) => h.title);
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Times New Roman', bold: true, size: 12 };
    });

    // Dữ liệu
    data.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(dataStartRow + 1 + rowIndex);

      headers.forEach((h, colIndex) => {
        const cell = excelRow.getCell(colIndex + 1);
        const value = (row as any)?.[h.key];

        if (h.render) {
          cell.value = h.render(row);
        } else if (h.isFormatCurrency && typeof value === 'number') {
          cell.value = value;
          cell.numFmt = '#,##0';
        } else {
          cell.value = value ?? '-';
        }

        cell.font = defaultFont;
      });
    });

    // Auto width (KHÔNG ghi đè font)
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const len = cell.value?.toString()?.length ?? 0;
        if (len + 2 > maxLength) maxLength = len + 2;
        // KHÔNG gán lại font ở đây
      });
      column.width = maxLength;
    });

    return workbook.xlsx.writeBuffer();
  }
}
