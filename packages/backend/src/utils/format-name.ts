export function formatName(name: string) {
  return name
    .trim() // loại bỏ khoảng trắng đầu/cuối
    .toLowerCase() // chuyển toàn bộ thành chữ thường
    .replace(/\s+/g, ' ') // chuẩn hóa khoảng trắng giữa các từ
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
