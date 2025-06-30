import { formatCurrency } from '@/helper'

const EXTEND_DISPLAY_NAME = 'ExtendDisplay'
const DEFAULT_WINDOW_CONFIG = {
  width: window.screen.availWidth,
  height: window.screen.availHeight,
  left: window.screen.width,
  top: 0,
  fullscreen: 'yes',
  screenX: window.screen.width,
  screenY: 0,
}

const DEFAULT_STYLES = `
  /* Font Family */
  .be-vietnam-pro-thin { font-family: "Be Vietnam Pro", sans-serif; font-weight: 100; font-style: normal; }
  .be-vietnam-pro-extralight { font-family: "Be Vietnam Pro", sans-serif; font-weight: 200; font-style: normal; }
  .be-vietnam-pro-light { font-family: "Be Vietnam Pro", sans-serif; font-weight: 300; font-style: normal; }
  .be-vietnam-pro-regular { font-family: "Be Vietnam Pro", sans-serif; font-weight: 400; font-style: normal; }
  .be-vietnam-pro-medium { font-family: "Be Vietnam Pro", sans-serif; font-weight: 500; font-style: normal; }
  .be-vietnam-pro-semibold { font-family: "Be Vietnam Pro", sans-serif; font-weight: 600; font-style: normal; }
  .be-vietnam-pro-bold { font-family: "Be Vietnam Pro", sans-serif; font-weight: 700; font-style: normal; }
  .be-vietnam-pro-extrabold { font-family: "Be Vietnam Pro", sans-serif; font-weight: 800; font-style: normal; }
  .be-vietnam-pro-black { font-family: "Be Vietnam Pro", sans-serif; font-weight: 900; font-style: normal; }

  /* Font Family Italic */
  .be-vietnam-pro-thin-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 100; font-style: italic; }
  .be-vietnam-pro-extralight-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 200; font-style: italic; }
  .be-vietnam-pro-light-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 300; font-style: italic; }
  .be-vietnam-pro-regular-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 400; font-style: italic; }
  .be-vietnam-pro-medium-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 500; font-style: italic; }
  .be-vietnam-pro-semibold-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 600; font-style: italic; }
  .be-vietnam-pro-bold-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 700; font-style: italic; }
  .be-vietnam-pro-extrabold-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 800; font-style: italic; }
  .be-vietnam-pro-black-italic { font-family: "Be Vietnam Pro", sans-serif; font-weight: 900; font-style: italic; }

  /* Display */
  .hidden { display: none; }
  .block { display: block; }

  /* Base Styles */
  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    margin: 0;
    background-color: #F5F5F5;
    font-family: "Be Vietnam Pro", sans-serif;
    font-size: 16px;
  }

  /* Layout */
  .extend-display {
    padding: 20px;
    height: calc(100% - 40px);
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  /* Fullscreen Button */
  .fullscreen-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #EAEAEA;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1F1F1F;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1000;
  }

  .fullscreen-button:hover {
    background: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Video Container */
  .extend-video-container {
    display: flex;
    flex: 2 1 0%;
    justify-content: center;
    align-items: center;
  }

  video {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  /* Content Container */
  .extend-content-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    justify-content: space-between;
    background-color: #fff;
    outline: 1px solid #EAEAEA;
    outline-offset: -0.5px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 1px 2px 0px rgba(9, 9, 11, 0.05), 0px 1px 2px 0px rgba(9, 9, 11, 0.05);
  }

  /* Content Header */
  .extend-content-header {
    background-color: #F5F5F5;
    padding: 8px 20px;
    border-bottom: 1px solid #EAEAEA;
    font-weight: 600;
    border-radius: 12px 12px 0 0;
  }

  /* Content Body */
  .extend-content-body {
    height: 100%;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding: 20px;
  }

  .extend-content-body-content,
  .extend-content-body-total {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .extend-content-body-content-item {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .extend-content-body-content-item-info {
    display: flex;
    gap: 8px;
  }

  /* Quantity Styles */
  .extend-content-body-content-item-qty,
  .extend-content-body-total-item-qty {
    color: #1F1F1F;
    font-size: 18px;
    font-weight: 600;
  }

  .extend-content-body-content-item-qty:before,
  .extend-content-body-total-item-qty:before {
    content: 'x';
  }

  /* Title Styles */
  .extend-content-body-content-item-title {
    font-weight: 500;
    color: #616161;
  }

  /* Price Styles */
  .extend-content-body-content-item-price,
  .extend-content-body-total-item-price {
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
    margin-left: auto;
    color: #1F1F1F;
  }

  .extend-content-body-content-item-price:after,
  .extend-content-body-total-item-price:after {
    content: 'đ';
    margin-left: 2px;
  }

  /* Footer */
  .extend-content-footer {
    height: fit-content;
    padding: 20px;
  }

  .extend-content-footer-content {
    background-color: #F5F5F5;
    padding: 16px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Note Styles */
  .extend-content-payment-note-title,
  .extend-content-note-title {
    font-weight: 600;
    color: #373737;
  }

  .extend-content-payment-note-content,
  .extend-content-note-content {
    font-size: 14px;
    color: #616161;
  }

  /* Divider */
  .solid-line {
    height: 1px;
    background-color: #EAEAEA;
  }
`

class ExtendDisplay {
  private extendDisplay: Window | null

  constructor() {
    this.extendDisplay = null
  }

  isOpen(): boolean {
    return !!(this.extendDisplay && !this.extendDisplay.closed)
  }

  focus(): boolean {
    if (this.isOpen() && this.extendDisplay) {
      this.extendDisplay.focus()
      return true
    }
    return false
  }

  private getWindowPosition(): { left: number; top: number } {
    return {
      left: window.screen.width,
      top: 0,
    }
  }

  private async requestFullscreen(element: HTMLElement): Promise<void> {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen()
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen()
      }
    } catch (error) {
      console.warn('Không thể bật chế độ toàn màn hình:', error)
    }
  }

  private async exitFullscreen(): Promise<void> {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
    } catch (error) {
      console.warn('Không thể tắt chế độ toàn màn hình:', error)
    }
  }

  private isFullscreen(): boolean {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    )
  }

  async toggleFullscreen(): Promise<void> {
    if (!this.extendDisplay) return

    try {
      if (this.isFullscreen()) {
        await this.exitFullscreen()
      } else {
        await this.requestFullscreen(this.extendDisplay.document.documentElement)
      }
    } catch (error) {
      console.error('Lỗi khi chuyển đổi chế độ toàn màn hình:', error)
    }
  }

  openExtendWindow(): boolean {
    try {
      if (this.isOpen()) {
        return this.focus()
      }

      // Mở cửa sổ với kích thước nhỏ hơn để tránh bị chặn
      this.extendDisplay = window.open('', EXTEND_DISPLAY_NAME, 'width=800,height=600,left=0,top=0')

      if (!this.extendDisplay) {
        throw new Error('Không mở được cửa sổ màn hình phụ. Có thể bị chặn popup.')
      }

      this.initializeExtendWindow()

      // Đợi DOM load xong và bật fullscreen
      this.extendDisplay.addEventListener('load', () => {
        // Đợi một chút để đảm bảo cửa sổ đã load xong
        setTimeout(() => {
          if (this.extendDisplay) {
            // Thử bật fullscreen
            try {
              if (this.extendDisplay.document.documentElement.requestFullscreen) {
                this.extendDisplay.document.documentElement.requestFullscreen()
              } else if ((this.extendDisplay.document.documentElement as any).webkitRequestFullscreen) {
                ;(this.extendDisplay.document.documentElement as any).webkitRequestFullscreen()
              } else if ((this.extendDisplay.document.documentElement as any).msRequestFullscreen) {
                ;(this.extendDisplay.document.documentElement as any).msRequestFullscreen()
              }
            } catch (error) {
              console.warn('Không thể bật chế độ toàn màn hình:', error)
            }
          }
        }, 100)
      })

      return true
    } catch (error: unknown) {
      console.error('Lỗi khi mở cửa sổ màn hình phụ:', error)
      alert(error instanceof Error ? error.message : 'Lỗi không xác định')
      return false
    }
  }

  private initializeExtendWindow(): void {
    if (!this.extendDisplay) return

    try {
      const doc = this.extendDisplay.document

      // Đảm bảo document được mở
      doc.open()

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Langfarm Center</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
            <style>${DEFAULT_STYLES}</style>
            <script>
              function toggleFullscreen() {
                if (!document.fullscreenElement) {
                  if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen()
                  } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen()
                  } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen()
                  }
                } else {
                  if (document.exitFullscreen) {
                    document.exitFullscreen()
                  } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                  } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                  }
                }
              }
            </script>
          </head>
          <body>
            <div class="extend-display">
              <button class="fullscreen-button" onclick="toggleFullscreen()">
                Toàn màn hình
              </button>
              <div class="extend-video-container">
                <video class="extend-video" autoplay loop muted>
                  <source src="/videos/lfc-video.mp4" type="video/mp4">
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              </div>
              <div class="extend-content-container">
                <div class="extend-content-header">
                  Hoá đơn thanh toán
                </div>

                <div class="extend-content-body">
                  <div class="extend-content-body-content">
                    <div class="extend-content-body-content-item">
                      Chưa có dịch vụ nào
                    </div>
                  </div>

                  <div class="solid-line" ></div>

                  <div class="extend-content-body-total">
                    <div class="extend-content-body-content-item">
                      <div class="extend-content-body-content-item-info">
                        <div class="extend-content-body-total-item-qty">0</div>
                        <div class="extend-content-body-content-item-title">Vé tổng cộng</div>
                      </div>
                      <div class="extend-content-body-total-item-price">0</div>
                    </div>
                  </div>
                </div>

                <div class="extend-content-footer hidden">
                  <div class="extend-content-footer-content">
                    <div class="extend-content-payment-note">
                      <div class="extend-content-payment-note-title">Nội dung thanh toán</div>
                      <div class="extend-content-payment-note-content">-</div>
                    </div>
                    <div class="extend-content-note">
                      <div class="extend-content-note-title">Ghi chú</div>
                      <div class="extend-content-note-content">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `

      doc.write(html)
      doc.close()
    } catch (error: unknown) {
      console.error('Lỗi khi khởi tạo cửa sổ màn hình phụ:', error)
      if (this.extendDisplay) {
        this.extendDisplay.close()
        this.extendDisplay = null
      }
      throw error
    }
  }

  updateContent(data: { qty: number; price: number; title: string }[]): void {
    if (!this.extendDisplay || this.extendDisplay.closed) {
      const success = this.openExtendWindow()
      if (!success) return
    }

    try {
      if (!this.extendDisplay) return
      const contentElement = this.extendDisplay.document.querySelector('.extend-content-body-content')
      if (contentElement) {
        contentElement.innerHTML = `
          ${data
            .map(
              (item) => `
            <div class="extend-content-body-content-item">
              <div class="extend-content-body-content-item-info">
                <div class="extend-content-body-content-item-qty">x${item.qty}</div>
                <div class="extend-content-body-content-item-title">${item.title}</div>
              </div>
              <div class="extend-content-body-content-item-price">${formatCurrency(item.price)}</div>
            </div>
        `,
            )
            .join('')}
        `
      }

      const totalItem = data.reduce(
        (acc, item) => {
          acc.total += item.price * item.qty
          acc.qty += item.qty
          return acc
        },
        {
          total: 0,
          qty: 0,
        },
      )

      const totalElement = this.extendDisplay.document.querySelector('.extend-content-body-total-item-price')
      const qtyElement = this.extendDisplay.document.querySelector('.extend-content-body-total-item-qty')
      if (totalElement) {
        totalElement.innerHTML = totalItem.total ? formatCurrency(totalItem.total) : '0'
      }
      if (qtyElement) {
        qtyElement.innerHTML = `${totalItem.qty || 0}`
      }

      // else {
      //   this.extendDisplay.document.body.innerHTML = newContentHtml
      // }
    } catch (error: unknown) {
      console.error('Lỗi khi cập nhật nội dung màn hình phụ:', error)
      alert('Không thể cập nhật nội dung màn hình phụ.')
    }
  }

  updatePaymentNote(paymentNote: string): void {
    if (!this.extendDisplay || this.extendDisplay.closed) {
      const success = this.openExtendWindow()
      if (!success) return
    }

    try {
      if (!this.extendDisplay) return
      const footerElement = this.extendDisplay.document.querySelector('.extend-content-footer')
      if (!footerElement) return
      const paymentNoteElement = footerElement.querySelector('.extend-content-payment-note-content')
      if (paymentNoteElement) {
        if (paymentNote) {
          footerElement.classList.remove('hidden')
          paymentNoteElement.classList.remove('hidden')
          paymentNoteElement.innerHTML = paymentNote
        } else {
          footerElement.classList.add('hidden')
          paymentNoteElement.classList.add('hidden')
        }
      }
    } catch (error: unknown) {
      console.error('Lỗi khi cập nhật nội dung thanh toán:', error)
      alert('Không thể cập nhật nội dung thanh toán.')
    }
  }

  updateNote(note: string): void {
    if (!this.extendDisplay || this.extendDisplay.closed) {
      const success = this.openExtendWindow()
      if (!success) return
    }

    try {
      if (!this.extendDisplay) return

      const footerElement = this.extendDisplay.document.querySelector('.extend-content-footer')
      if (!footerElement) return

      const noteElement = footerElement.querySelector('.extend-content-note-content')
      if (noteElement) {
        if (note) {
          footerElement.classList.remove('hidden')
          noteElement.classList.remove('hidden')
          noteElement.innerHTML = note
        } else {
          footerElement.classList.add('hidden')
          noteElement.classList.add('hidden')
        }
      }
    } catch (error: unknown) {
      console.error('Lỗi khi cập nhật ghi chú:', error)
      alert('Không thể cập nhật ghi chú.')
    }
  }

  closeExtendWindow(): void {
    if (this.extendDisplay && !this.extendDisplay.closed) {
      this.extendDisplay.close()
      this.extendDisplay = null
    }
  }
}

export const extendDisplay = new ExtendDisplay()
