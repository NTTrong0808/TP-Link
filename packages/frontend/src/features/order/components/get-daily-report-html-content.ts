export const getDailyReportHtmlContent = () => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo Cáo Nộp Tiền</title>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Be Vietnam Pro', sans-serif; margin: 40px; font-size: 14px; }
    h2, h3 { font-size: 12px; font-weight: 400; margin: 4px 0; }
    .info { margin-top: 20px; font-size: 12px; }
    .info p { margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
    th, td { border: 1px solid #000; padding: 6px; text-align: left; }
    .signature { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; }
    .signature div { width: 45%; text-align: center; }
    .title { font-size: 15px; margin-top: 16px; font-weight: 700; }
    .report-date { margin: 0; font-size: 12px; }
    .sub-field { text-align: end; }
  </style>
</head>
<body>
  <h2>LANGFARM CENTER - DỊCH VỤ</h2>
  <h3>Số 1B đường Hoàng Văn Thụ, P. 5, TP. Đà Lạt</h3>
  <h2 class="title">BÁO CÁO NỘP TIỀN</h2>
  <p class="report-date">Ngày: 07/05/2025</p>
  <div class="info">
    <p>Thu ngân: Nguyễn Văn A</p>
    <p>Thời gian in: 07/05/2025 17:00:00</p>
  </div>
  <table>
    <tr><th>STT</th><th>Chỉ tiêu</th><th>Số tiền</th></tr>
    <tr><td><b>I</b></td><td><b>Tiền lưu két</b></td><td></td></tr>
    <tr><td><b>II</b></td><td><b>Tổng doanh số</b></td><td></td></tr>
    <tr><td class="sub-field">1</td><td>Tiền mặt</td><td></td></tr>
    <tr><td class="sub-field">2</td><td>Payoo</td><td></td></tr>
    <tr><td class="sub-field">3</td><td>Chuyển khoản</td><td></td></tr>
    <tr><td class="sub-field">4</td><td>Voucher</td><td></td></tr>
    <tr><td class="sub-field">5</td><td>Điểm</td><td></td></tr>
    <tr><td><b>III</b></td><td><b>Tiền mặt phải nộp</b></td><td></td></tr>
    <tr><td class="sub-field">1</td><td>Thực nộp</td><td></td></tr>
    <tr><td class="sub-field">2</td><td>Chênh lệch</td><td></td></tr>
  </table>
  <p style="margin-top: 20px;font-size: 12px">Ghi chú:</p>
  <div class="signature">
    <div>
      <p>Người giao</p>
      <p>(Ký, ghi họ tên)</p>
    </div>
    <div>
      <p>Người nhận</p>
      <p>(Ký, ghi họ tên)</p>
    </div>
  </div>
</body>
</html>
`
