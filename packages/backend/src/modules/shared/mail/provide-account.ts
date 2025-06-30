/**
 * Template html for reset password
 */
export const provideAccount = (username: string, password: string, navigateUrl: string) => {
  // !DEV: Enhance this based on design
  return `
 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  dir="ltr"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="vi"
>
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="telephone=no" name="format-detection" />
    <title>Empty template</title>
    <!--[if (mso 16)]>
      <style type="text/css">
        a {
          text-decoration: none;
        }
      </style>
    <![endif]-->
    <!--[if gte mso 9
      ]><style>
        sup {
          font-size: 100% !important;
        }
      </style><!
    [endif]-->
    <!--[if gte mso 9]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <!--[if mso
      ]><xml>
        <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
          <w:DontUseAdvancedTypographyReadingMail />
        </w:WordDocument> </xml
    ><![endif]-->
    <style type="text/css">
      @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
      .rollover:hover .rollover-first {
        max-height: 0px !important;
        display: none !important;
      }
      .rollover:hover .rollover-second {
        max-height: none !important;
        display: block !important;
      }
      .rollover span {
        font-size: 0px;
      }
      u + .body img ~ div div {
        display: none;
      }
      #outlook a {
        padding: 0;
      }
      span.MsoHyperlink,
      span.MsoHyperlinkFollowed {
        color: inherit;
        mso-style-priority: 99;
      }
      a.es-button {
        mso-style-priority: 100 !important;
        text-decoration: none !important;
      }
      a[x-apple-data-detectors],
      #MessageViewBody a {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
        mso-hide: all;
      }
      @media only screen and (max-width: 600px) {
        .es-m-p20b {
          padding-bottom: 20px !important;
        }
        .es-p-default {
        }
        *[class="gmail-fix"] {
          display: none !important;
        }
        p,
        a {
          line-height: 150% !important;
        }
        h1,
        h1 a {
          line-height: 120% !important;
        }
        h2,
        h2 a {
          line-height: 120% !important;
        }
        h3,
        h3 a {
          line-height: 120% !important;
        }
        h4,
        h4 a {
          line-height: 120% !important;
        }
        h5,
        h5 a {
          line-height: 120% !important;
        }
        h6,
        h6 a {
          line-height: 120% !important;
        }
        .es-header-body p {
        }
        .es-content-body p {
        }
        .es-footer-body p {
        }
        .es-infoblock p {
        }
        h1 {
          font-size: 40px !important;
          text-align: left;
        }
        h2 {
          font-size: 32px !important;
          text-align: left;
        }
        h3 {
          font-size: 28px !important;
          text-align: left;
        }
        h4 {
          font-size: 24px !important;
          text-align: left;
        }
        h5 {
          font-size: 20px !important;
          text-align: left;
        }
        h6 {
          font-size: 16px !important;
          text-align: left;
        }
        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
          font-size: 40px !important;
        }
        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
          font-size: 32px !important;
        }
        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
          font-size: 28px !important;
        }
        .es-header-body h4 a,
        .es-content-body h4 a,
        .es-footer-body h4 a {
          font-size: 24px !important;
        }
        .es-header-body h5 a,
        .es-content-body h5 a,
        .es-footer-body h5 a {
          font-size: 20px !important;
        }
        .es-header-body h6 a,
        .es-content-body h6 a,
        .es-footer-body h6 a {
          font-size: 16px !important;
        }
        .es-menu td a {
          font-size: 14px !important;
        }
        .es-header-body p,
        .es-header-body a {
          font-size: 14px !important;
        }
        .es-content-body p,
        .es-content-body a {
          font-size: 14px !important;
        }
        .es-footer-body p,
        .es-footer-body a {
          font-size: 14px !important;
        }
        .es-infoblock p,
        .es-infoblock a {
          font-size: 12px !important;
        }
        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3,
        .es-m-txt-c h4,
        .es-m-txt-c h5,
        .es-m-txt-c h6 {
          text-align: center !important;
        }
        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3,
        .es-m-txt-r h4,
        .es-m-txt-r h5,
        .es-m-txt-r h6 {
          text-align: right !important;
        }
        .es-m-txt-j,
        .es-m-txt-j h1,
        .es-m-txt-j h2,
        .es-m-txt-j h3,
        .es-m-txt-j h4,
        .es-m-txt-j h5,
        .es-m-txt-j h6 {
          text-align: justify !important;
        }
        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3,
        .es-m-txt-l h4,
        .es-m-txt-l h5,
        .es-m-txt-l h6 {
          text-align: left !important;
        }
        .es-m-txt-r img,
        .es-m-txt-c img,
        .es-m-txt-l img {
          display: inline !important;
        }
        .es-m-txt-r .rollover:hover .rollover-second,
        .es-m-txt-c .rollover:hover .rollover-second,
        .es-m-txt-l .rollover:hover .rollover-second {
          display: inline !important;
        }
        .es-m-txt-r .rollover span,
        .es-m-txt-c .rollover span,
        .es-m-txt-l .rollover span {
          line-height: 0 !important;
          font-size: 0 !important;
          display: block;
        }
        .es-spacer {
          display: inline-table;
        }
        a.es-button,
        button.es-button {
          font-size: 14px !important;
          padding: 10px 20px 10px 20px !important;
          line-height: 120% !important;
        }
        a.es-button,
        button.es-button,
        .es-button-border {
          display: inline-block !important;
        }
        .es-m-fw,
        .es-m-fw.es-fw,
        .es-m-fw .es-button {
          display: block !important;
        }
        .es-m-il,
        .es-m-il .es-button,
        .es-social,
        .es-social td,
        .es-menu {
          display: inline-block !important;
        }
        .es-adaptive table,
        .es-left,
        .es-right {
          width: 100% !important;
        }
        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
          width: 100% !important;
          max-width: 600px !important;
        }
        .adapt-img {
          width: 100% !important;
          height: auto !important;
        }
        .es-mobile-hidden,
        .es-hidden {
          display: none !important;
        }
        .es-desk-hidden {
          width: auto !important;
          overflow: visible !important;
          float: none !important;
          max-height: inherit !important;
          line-height: inherit !important;
        }
        tr.es-desk-hidden {
          display: table-row !important;
        }
        table.es-desk-hidden {
          display: table !important;
        }
        td.es-desk-menu-hidden {
          display: table-cell !important;
        }
        .es-menu td {
          width: 1% !important;
        }
        table.es-table-not-adapt,
        .esd-block-html table {
          width: auto !important;
        }
        .h-auto {
          height: auto !important;
        }
        .es-m-w-100 {
          width: -100% !important;
        }
        .es-text-5732 .es-text-mobile-size-16,
        .es-text-5732 .es-text-mobile-size-16 * {
          font-size: 16px !important;
          line-height: 150% !important;
        }
        .es-text-3720 .es-text-mobile-size-24,
        .es-text-3720 .es-text-mobile-size-24 * {
          font-size: 24px !important;
          line-height: 150% !important;
        }
        .es-text-2193 .es-text-mobile-size-18,
        .es-text-2193 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
        .es-text-1816 .es-text-mobile-size-18,
        .es-text-1816 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
        .es-text-7496 .es-text-mobile-size-18,
        .es-text-7496 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
        .es-text-4773 .es-text-mobile-size-18,
        .es-text-4773 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
        .es-text-2469 .es-text-mobile-size-18,
        .es-text-2469 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
        .es-text-7131 .es-text-mobile-size-18,
        .es-text-7131 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
        .es-text-2909 .es-text-mobile-size-18,
        .es-text-2909 .es-text-mobile-size-18 * {
          font-size: 18px !important;
          line-height: 150% !important;
        }
      }
      @media screen and (max-width: 384px) {
        .mail-message-content {
          width: 414px !important;
        }
      }
    </style>
  </head>
  <body
    class="body"
    style="
      width: 100%;
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      padding: 0;
      margin: 0;
    "
  >
    <div
      dir="ltr"
      class="es-wrapper-color"
      lang="vi"
      style="background-color: #f6f6f6"
    >
      <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#f6f6f6"></v:fill>
        </v:background>
      <![endif]-->
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        class="es-wrapper"
        role="none"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-collapse: collapse;
          border-spacing: 0px;
          padding: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          background-color: #f6f6f6;
        "
      >
        <tr>
          <td valign="top" style="padding: 0; margin: 0">
            <table
              cellspacing="0"
              cellpadding="0"
              align="center"
              class="es-content"
              role="none"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                width: 100%;
                table-layout: fixed !important;
              "
            >
              <tr>
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                    class="es-content-body"
                    role="none"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      width: 600px;
                    "
                  >
                    <tr>
                      <td align="left" style="padding: 0; margin: 0">
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              valign="top"
                              align="center"
                              style="padding: 0; margin: 0; width: 600px"
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <img
                                      src="https://ekiwvcd.stripocdn.email/content/guids/CABINET_1a82caf79d9581284abc6d9b44a5b3bf40afc3ce456d17bd77674c389182e482/images/image_1.png"
                                      alt=""
                                      width="600"
                                      class="adapt-img"
                                      style="
                                        display: block;
                                        font-size: 14px;
                                        border: 0;
                                        outline: none;
                                        text-decoration: none;
                                      "
                                    />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellspacing="0"
              cellpadding="0"
              align="center"
              class="es-footer"
              role="none"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                width: 100%;
                table-layout: fixed !important;
                background-color: transparent;
              "
            >
              <tr>
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                    class="es-footer-body"
                    role="none"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      width: 600px;
                    "
                  >
                    <tr>
                      <td
                        align="left"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-top: 40px;
                          padding-right: 40px;
                          padding-left: 40px;
                        "
                      >
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          align="left"
                          class="es-left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              class="es-m-p20b"
                              style="padding: 0; margin: 0; width: 520px"
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-3720"
                                    style="padding: 0; margin: 0"
                                  >
                                    <h1
                                      class="es-text-mobile-size-24"
                                      style="
                                        margin: 0;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        mso-line-height-rule: exactly;
                                        letter-spacing: 0;
                                        font-size: 24px;
                                        font-style: normal;
                                        font-weight: normal;
                                        line-height: 28.8px;
                                        color: #1f1f1f;
                                      "
                                    >
                                      <strong style="font-weight: 600"
                                        >Thân chào,</strong
                                      >
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 0; margin: 0">
                        <table
                          cellpadding="0"
                          align="left"
                          cellspacing="0"
                          class="es-left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              class="es-m-p20b"
                              style="padding: 0; margin: 0; width: 600px"
                            >
                              <table
                                cellspacing="0"
                                cellpadding="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-2193"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                      padding-top: 12px;
                                    "
                                  >
                                    <p
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 27px;
                                        letter-spacing: 0;
                                        color: #1f1f1f;
                                        font-size: 18px;
                                      "
                                    >
                                    Chúc mừng bạn đã chính thức trở thành một thành viên của công ty! Dưới đây là thông tin tài khoản của bạn:
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-7496"
                                    style="
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                      padding-top: 24px;
                                      padding-bottom: 12px;
                                    "
                                  >
                                    <p
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 18px;
                                        letter-spacing: 0;
                                        color: #1f1f1f;
                                        font-size: 20px;
                                      "
                                    >
                                      👤 Tên đăng nhập: &nbsp;<strong
                                        style="font-weight: 500"
                                        >${username}</strong
                                      >
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-4773"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                      padding-bottom: 24px;
                                    "
                                  >
                                    <p
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 18px;
                                        letter-spacing: 0;
                                        color: #1f1f1f;
                                        font-size: 20px;
                                      "
                                    >
                                      🔑 Mật khẩu tạm thời: &nbsp;<strong
                                        style="font-weight: 500"
                                        >${password}</strong
                                      >
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-2469"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                      padding-bottom: 12px;
                                    "
                                  >
                                    <p
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 27px;
                                        letter-spacing: 0;
                                        color: #1f1f1f;
                                        font-size: 18px;
                                      "
                                    >
                                      Để bắt đầu, vui lòng đăng nhập vào hệ
                                      thống bằng đường link dưới đây:
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-7131"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                      padding-bottom: 24px;
                                    "
                                  >
                                    <a
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 27px;
                                        letter-spacing: 0;
                                        font-size: 20px;
                                        text-decoration: none;
                                      "
                                      href="${navigateUrl}"
                                    >
                                      LINK
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-1816"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                    "
                                  >
                                    <p
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 27px;
                                        letter-spacing: 0;
                                        color: #1f1f1f;
                                        font-size: 18px;
                                      "
                                    >
                                      Lưu ý: Vì lý do bảo mật, bạn nên đổi mật
                                      khẩu ngay sau lần đăng nhập đầu tiên
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-2909"
                                    style="
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                      padding-top: 12px;
                                      padding-bottom: 40px;
                                    "
                                  >
                                    <p
                                      class="es-text-mobile-size-18"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 27px;
                                        letter-spacing: 0;
                                        color: #1f1f1f;
                                        font-size: 18px;
                                      "
                                    >
                                      Trân trọng,
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        bgcolor="#f3f3f9"
                        style="
                          margin: 0;
                          padding-right: 40px;
                          padding-left: 40px;
                          padding-top: 24px;
                          padding-bottom: 24px;
                          background-color: #f3f3f9;
                        "
                      >
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          align="left"
                          class="es-left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 520px"
                            >
                              <table
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    class="es-text-5732"
                                    style="padding: 0; margin: 0"
                                  >
                                    <p
                                      class="es-text-mobile-size-16"
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 24px;
                                        letter-spacing: 0;
                                        color: #616161;
                                        font-size: 16px;
                                      "
                                    >
                                      Nếu bạn cần hỗ trợ thêm, đừng ngần ngại
                                      liên hệ với chúng tôi:
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        bgcolor="#f3f3f9"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 40px;
                          padding-left: 40px;
                          background-color: #f3f3f9;
                        "
                      >
                        <!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr><td style="width:30px" valign="top"><![endif]-->
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          align="left"
                          class="es-left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 30px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <img
                                      alt=""
                                      width="24"
                                      src="https://ekiwvcd.stripocdn.email/content/guids/CABINET_1a82caf79d9581284abc6d9b44a5b3bf40afc3ce456d17bd77674c389182e482/images/phonecall.png"
                                      style="
                                        display: block;
                                        font-size: 14px;
                                        border: 0;
                                        outline: none;
                                        text-decoration: none;
                                      "
                                    />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td><td style="width:10px"></td><td style="width:480px" valign="top"><![endif]-->
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          align="right"
                          class="es-right"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: right;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 480px"
                            >
                              <table
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                cellpadding="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-top: 2px;
                                    "
                                  >
                                    <p
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 14px;
                                        letter-spacing: 0;
                                        color: #333333;
                                        font-size: 14px;
                                      "
                                    >
                                      Hotline (7:3<span
                                        style="line-height: 150%"
                                        >0 - 17:30) - 0931904904</span
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        bgcolor="#f3f3f9"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 40px;
                          padding-left: 40px;
                          padding-top: 12px;
                          background-color: #f3f3f9;
                        "
                      >
                        <!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr><td style="width:30px" valign="top"><![endif]-->
                        <table
                          cellspacing="0"
                          align="left"
                          cellpadding="0"
                          class="es-left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 30px"
                            >
                              <table
                                width="100%"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <img
                                      src="https://ekiwvcd.stripocdn.email/content/guids/CABINET_1a82caf79d9581284abc6d9b44a5b3bf40afc3ce456d17bd77674c389182e482/images/envelope.png"
                                      alt=""
                                      width="24"
                                      style="
                                        display: block;
                                        font-size: 14px;
                                        border: 0;
                                        outline: none;
                                        text-decoration: none;
                                      "
                                    />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td><td style="width:10px"></td><td style="width:480px" valign="top"><![endif]-->
                        <table
                          align="right"
                          cellpadding="0"
                          cellspacing="0"
                          class="es-right"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: right;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 480px"
                            >
                              <table
                                width="100%"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-top: 2px;
                                    "
                                  >
                                    <p
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 21px;
                                        letter-spacing: 0;
                                        color: #333333;
                                        font-size: 14px;
                                      "
                                    >
                                      center@langfarm.com
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        bgcolor="#f3f3f9"
                        style="
                          margin: 0;
                          padding-right: 40px;
                          padding-left: 40px;
                          padding-top: 12px;
                          padding-bottom: 24px;
                          background-color: #f3f3f9;
                        "
                      >
                        <!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr><td style="width:30px" valign="top"><![endif]-->
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          align="left"
                          class="es-left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 30px"
                            >
                              <table
                                width="100%"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <img
                                      src="https://ekiwvcd.stripocdn.email/content/guids/CABINET_1a82caf79d9581284abc6d9b44a5b3bf40afc3ce456d17bd77674c389182e482/images/mappinarea.png"
                                      alt=""
                                      width="24"
                                      style="
                                        display: block;
                                        font-size: 14px;
                                        border: 0;
                                        outline: none;
                                        text-decoration: none;
                                      "
                                    />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td><td style="width:10px"></td><td style="width:480px" valign="top"><![endif]-->
                        <table
                          align="right"
                          cellpadding="0"
                          cellspacing="0"
                          class="es-right"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: right;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 480px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    style="padding: 0; margin: 0"
                                  >
                                    <p
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: 'Be Vietnam Pro',
                                          'helvetica neue', helvetica,
                                          sans-serif;
                                        line-height: 21px;
                                        letter-spacing: 0;
                                        color: #333333;
                                        font-size: 14px;
                                      "
                                    >
                                      Số 1B đường Hoàng Văn Thụ, Phường 5, Thành
                                      phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

      `
}
