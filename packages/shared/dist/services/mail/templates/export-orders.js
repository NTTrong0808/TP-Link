"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportOrderTemplate = void 0;
const exportOrderTemplate = ({ exportedAt, }) => `<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Báo cáo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>

<body style="width: 100%; height: 100%;">
  <div style="width: 100%; height: 100%; color: #1F1F1F;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; border: 1px solid #f5f5f5;">
      <div style="height: 80px; padding: 40px; background-image: url('https://langfarm-staging-backend.s3.ap-southeast-1.amazonaws.com/email-header.png'); background-size: cover; background-position: center; background-repeat: no-repeat; text-align: center;">
        <div style="margin-top: 22px; color: #FFFAF2; font-size: 30px; font-family: Langfarm Display; font-weight: 600; word-wrap: break-word; text-shadow: 0px 0px 35px rgba(167, 77, 26, 0.70);">
          Langfarm Ticket
        </div>
      </div>
      <div style="padding: 40px;">
        <div style="margin-bottom: 24px;">
          <div style="font-size: 24px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 600; line-height: 32px; margin-bottom: 12px;">
            Báo cáo Excel từ Langfarm Ticket
          </div>
          <div style="font-size: 18px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400; line-height: 28px;">
            Dưới đây là báo cáo được xuất vào lúc <strong>${exportedAt}</strong>.
          </div>
        </div>

        <div style="margin-top: 24px;">
          <div style="font-size: 18px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400; line-height: 28px;">
            Nếu bạn không yêu cầu báo cáo này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.
          </div>
        </div>
      </div>

      <div style="padding: 24px 40px; background: #F3F3F9;">
        <div style="color: #616161; font-size: 16px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400; line-height: 24px; margin-bottom: 24px;">
          Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi:
        </div>
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <img src="https://langfarm-staging-backend.s3.ap-southeast-1.amazonaws.com/phone.png" alt="phone" style="width: 24px; height: 24px;" />
            <div style="margin-left: 10px; font-size: 16px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400;">
              Hotline (07:30 - 17:30): 0931904904
            </div>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <img src="https://langfarm-staging-backend.s3.ap-southeast-1.amazonaws.com/email.png" alt="email" style="width: 24px; height: 24px;" />
            <div style="margin-left: 10px; font-size: 16px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400;">
             center@langfarm.com
            </div>
          </div>
          <div style="display: flex; align-items: center;">
            <img src="https://langfarm-staging-backend.s3.ap-southeast-1.amazonaws.com/location.png" alt="location" style="width: 24px; height: 24px;" />
            <div style="margin-left: 10px; font-size: 16px; font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400;">
           Số 1B đường Hoàng Văn Thụ, Phường 5, TP Đà Lạt, Lâm Đồng
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
`;
exports.exportOrderTemplate = exportOrderTemplate;
//# sourceMappingURL=export-orders.js.map