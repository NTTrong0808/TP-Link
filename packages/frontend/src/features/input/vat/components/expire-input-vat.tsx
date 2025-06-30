import DinosaurBlockImage from '@/components/widgets/icons/dinosaur-block-image'

const ExpireInputVat = () => {
  return (
    <div className="h-full flex-1 flex flex-col justify-center items-center gap-10 text-pretty text-center px-8">
      <div className="flex flex-col gap-2 justify-center items-center text-green-700 font-langfarm px-9">
        <h2>Mã QR hết hạn</h2>
        <div>Biên lai này đã quá thời hạn sửa thông tin xuất hóa đơn GTGT</div>
      </div>

      <DinosaurBlockImage className="size-[140px]" />

      <div className="text-xs text-neutral-grey-600">
        Biên lai thanh toán chỉ có giá trị xuất hóa đơn GTGT trong vòng 120 phút tính từ lúc in biên lai và trước 22:00
        trong vòng ngày mua hàng / dịch vụ
      </div>
    </div>
  )
}

export default ExpireInputVat
