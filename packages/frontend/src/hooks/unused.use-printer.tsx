// TODO: Not used

import { useCallback, useEffect, useState } from "react";

enum PrinterPaperWidthType {
  thermal = "80mm",
  normal = "210mm",
}

enum PrinterPaperHeightType {
  thermal = "auto",
  normal = "297mm",
}

interface PrinterOptions {
  type?: keyof typeof PrinterPaperWidthType;
  paperSize?: {
    width: PrinterPaperWidthType | string;
    height?: PrinterPaperHeightType | string;
  };
  orientation?: "portrait" | "landscape";
  margins?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  font?: {
    family: string;
    size: string;
  };
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
  onError?: (error: Error) => void;
  contentRef?: React.RefObject<HTMLElement> | null | undefined;
}

interface PrinterState {
  isPrinting: boolean;
  error: Error | null;
}

const usePrinter = (options: PrinterOptions = {}) => {
  const {
    type = "normal",
    paperSize = {
      width: PrinterPaperWidthType[type],
      height: PrinterPaperHeightType[type],
    },
    orientation = "portrait",
    onBeforePrint,
    onAfterPrint,
    onError,
    contentRef,
  } = options;

  const [state, setState] = useState<PrinterState>({
    isPrinting: false,
    error: null,
  });

  // Tạo style cho in ấn
  const createPrintStyles = useCallback(() => {
    const style = document.createElement("style");
    style.setAttribute("id", "custom-print-styles");

    const paperHeight =
      type === "thermal" ? "auto" : paperSize.height || "297mm";

    const css = `
      @page {
        size: ${paperSize.width} ${paperHeight} ${orientation};
      }

      @media print {

        #header,
        #footer,
        #nav {
          display: none !important;
        }

        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .no-print {
          display: none !important;
        }

        .page-break {
          page-break-before: always;
        }

        .keep-together {
          page-break-inside: avoid;
        }

        ${
          type === "thermal"
            ? `
          .thermal-content {
            width: ${paperSize.width};
            margin: 0;
            padding: 0;
          }
        `
            : ""
        }
      }
    `;

    style.innerHTML = css;
    return style;
  }, [type, paperSize, orientation]);

  // Kiểm tra khả năng in
  const checkPrinterAvailability = useCallback(async () => {
    try {
      if (!window.print) {
        throw new Error("Trình duyệt không hỗ trợ in ấn");
      }
      return true;
    } catch (error) {
      if (onError) onError(error as Error);
      setState((prev) => ({ ...prev, error: error as Error }));
      return false;
    }
  }, [onError]);

  // Xử lý sự kiện in
  useEffect(() => {
    const handleBeforePrint = () => {
      setState((prev) => ({ ...prev, isPrinting: true }));
      if (onBeforePrint) onBeforePrint();
    };

    const handleAfterPrint = () => {
      setState((prev) => ({ ...prev, isPrinting: false }));
      if (onAfterPrint) onAfterPrint();
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [onBeforePrint, onAfterPrint]);

  // Hàm in chính
  const print = useCallback(async () => {
    try {
      const canPrint = await checkPrinterAvailability();
      if (!canPrint) return;

      const printStyle = createPrintStyles();
      document.head.appendChild(printStyle);

      if (contentRef?.current) {
        // Lưu lại nội dung gốc của body
        const originalContent = document.body.innerHTML;

        // Thay thế nội dung body bằng element cần in
        document.body.innerHTML = contentRef.current.outerHTML;

        // Thực hiện in
        window.print();

        // Khôi phục lại nội dung gốc
        document.body.innerHTML = originalContent;
      } else {
        // Nếu không có contentRef, in toàn bộ trang như cũ
        window.print();
      }

      // Cleanup
      setTimeout(() => {
        document.head.removeChild(printStyle);
      }, 0);
    } catch (error) {
      if (onError) onError(error as Error);
      setState((prev) => ({ ...prev, error: error as Error }));
    }
  }, [checkPrinterAvailability, createPrintStyles, onError, contentRef]);

  // Thêm useEffect để xử lý phím tắt in
  useEffect(() => {
    const handleKeyboardPrint = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        print();
      }
    };

    // Thêm event listener
    window.addEventListener("keydown", handleKeyboardPrint);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyboardPrint);
    };
  }, [print]);

  return {
    print,
    ...state,
  };
};

export default usePrinter;
