const vietnamHolidays: Record<string, string> = {
  '01/01': 'Tết Dương Lịch',
  '03/02': 'Ngày thành lập Đảng Cộng sản Việt Nam',
  '14/02': 'Ngày Lễ Tình Nhân (Valentine)',
  '08/03': 'Ngày Quốc tế Phụ nữ',
  '20/03': 'Ngày Quốc tế Hạnh phúc',
  '30/04': 'Ngày Giải phóng Miền Nam',
  '01/05': 'Ngày Quốc tế Lao động',
  '07/05': 'Ngày Chiến thắng Điện Biên Phủ',
  '19/05': 'Ngày sinh Chủ tịch Hồ Chí Minh',
  '01/06': 'Ngày Quốc tế Thiếu nhi',
  '28/06': 'Ngày Gia đình Việt Nam',
  '27/07': 'Ngày Thương binh Liệt sĩ',
  '19/08': 'Ngày Cách mạng tháng Tám thành công',
  '02/09': 'Ngày Quốc khánh Việt Nam',
  '10/10': 'Ngày Giải phóng Thủ đô',
  '13/10': 'Ngày Doanh nhân Việt Nam',
  '20/10': 'Ngày Phụ nữ Việt Nam',
  '09/11': 'Ngày Pháp luật Việt Nam',
  '20/11': 'Ngày Nhà giáo Việt Nam',
  '22/12': 'Ngày thành lập Quân đội Nhân dân Việt Nam',
  '24/12': 'Lễ Giáng Sinh',
};

export function getVietnamHoliday(dateString?: string) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  const key = `${day}/${month}`;
  return vietnamHolidays[key] || null;
}
