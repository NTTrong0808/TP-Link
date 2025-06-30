import { Field } from '@/components/ui/form'
import { URLS } from '@/constants/urls'
import { IGroupPriceConfig } from '@/lib/api/queries/service-price-list/types'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { formatInternationalCurrency } from '@/utils/currency'
import Link from 'next/link'

type Props = {
  saleChannelId: string
  saleChannelName: string
  groupPriceConfigs: IGroupPriceConfig[]
  isActive: boolean
}
const SaleChannelServices = ({ saleChannelId, saleChannelName, groupPriceConfigs, isActive }: Props) => {
  const isCanAccess = useCanAccess()
  const disabled = !isCanAccess(CASL_ACCESS_KEY.TICKET_UPDATE_SERVICE_PRICE_LIST)
  return (
    <div className="w-full flex flex-col border-[1px] border-[#eaeaea] rounded-md">
      <p className="px-4 py-1 bg-[#f5f5f5] font-medium border-b-[1px] border-[#eaeaea]">{saleChannelName}</p>
      <div className={cn('p-4 flex w-full flex-col gap-3', disabled && '!text-[#A7A7A7]')}>
        {groupPriceConfigs?.length === 0 && (
          <span className="text-sm font-medium text-neutral-grey-400 text-center w-full">
            Không có dịch vụ nào được mở bán trong kênh này
          </span>
        )}
        {groupPriceConfigs.map((group) => (
          <div className="flex flex-col gap-2 w-full" key={`${saleChannelId}-${group.serviceId}`}>
            <span className="font-medium bg-secondary-[#1F1F1F]">{group?.serviceTitle?.vi}</span>
            {group?.priceConfigs?.map((config) => (
              <div className="w-full flex items-start justify-between" key={config.id}>
                <span className={cn('text-secondary-foreground', disabled && '!text-[#A7A7A7]')}>
                  {config?.targetTitle?.vi} ({config?.targetShortTitle?.vi})
                </span>
                <div className="flex gap-2">
                  <Field
                    name={config.id}
                    component="text"
                    type="number"
                    placeholder={formatInternationalCurrency(config.price)}
                    className="max-w-[160px] w-[160px] min-w-[160px]"
                    size="sm"
                    suffix="đ"
                    disabled={disabled}
                  />
                  <Field
                    name={`serviceCode-${config.id}`}
                    component="text"
                    type="number"
                    placeholder={'Mã sản phẩm'}
                    className="max-w-[160px] w-[160px] min-w-[160px]"
                    size="sm"
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
        {isActive === false && (
          <p className="text-sm text-[#1F1F1F]">
            Kênh này đã được vô hiệu hoá trong{' '}
            <Link href={URLS.ADMIN.SALE_CHANNEL.INDEX} className="text-[#2970FF]">
              Quản lý kênh bán
            </Link>
            , vui lòng kích hoạt để có thể áp dụng vào bảng giá
          </p>
        )}
      </div>
    </div>
  )
}

export default SaleChannelServices
