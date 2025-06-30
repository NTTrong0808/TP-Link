export function readMoney(num: number) {
  if (isNaN(num) || !isFinite(num)) return "Không hợp lệ";
  if (num === 0) return "Không đồng";
  num = Math.round(num);
  
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
  const ones = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  
  const readThreeDigits = (n: number, isLastChunk: boolean = false): string => {
    if (n === 0) return "";
    
    let result = "";
    const hundred = Math.floor(n / 100);
    const ten = Math.floor((n % 100) / 10);
    const one = n % 10;
    
    if (hundred > 0) {
      result += ones[hundred] + " trăm ";
    } else if (n > 99) {
      result += "không trăm ";
    }
    
    if (ten > 1) {
      result += ones[ten] + " mươi ";
      
      // Handle ones place with tens > 1
      if (one === 1) {
        result += "mốt"; // Use "mốt" instead of "một" when in the position after "mươi"
      } else if (one === 4) {
        result += "tư"; // Use "tư" instead of "bốn" in certain positions
      } else if (one === 5) {
        result += "lăm"; // Use "lăm" instead of "năm" after "mươi"
      } else if (one > 0) {
        result += ones[one];
      }
    } else if (ten === 1) {
      result += "mười ";
      // Handle ones place with ten == 1
      if (one === 5) {
        result += "lăm"; // "mười lăm" instead of "mười năm"
      } else if (one > 0) {
        result += ones[one];
      }
    } else if (one > 0) { // ten == 0
      if ((hundred > 0) || (!isLastChunk && n < 10)) {
        result += "lẻ ";
      }
      result += ones[one];
    }
    
    return result.trim();
  };

  let result = "";
  let unitIndex = 0;
  let remainingNum = num;

  while (remainingNum > 0) {
    const chunk = remainingNum % 1000;
    const isLastChunk = remainingNum < 1000;
    
    if (chunk > 0) {
      const chunkWords = readThreeDigits(chunk, isLastChunk);
      const unitWord = units[unitIndex] ? " " + units[unitIndex] : "";
      
      // Add to the beginning of the result (reverse order)
      result = chunkWords + unitWord + (result ? " " + result : "");
    }
    
    remainingNum = Math.floor(remainingNum / 1000);
    unitIndex++;
  }

  result = result.trim() + " đồng";
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}