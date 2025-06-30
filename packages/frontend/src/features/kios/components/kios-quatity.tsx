import { SALE_CHANNEL_TA_CODE } from '@/lib/api/queries/service/get-services-by-sale-channel-code'
import { transformFullServiceName } from '@/utils/tranform-full-service-name'
import { useOrderTA } from '../hooks/use-order-ta'
import { useKiosContext } from './kios-context'
import KiosQuantityInput from './kios-quatity-input'
import { KiosSection } from './kios-section'

export interface KiosQuatityProps {}

const KiosQuatity = (props: KiosQuatityProps) => {
  const { services } = useKiosContext()

  const [ta] = useOrderTA()

  return (
    <KiosSection
      title="Số lượng vé"
      contentProps={{
        className: 'flex flex-col gap-4 overflow-y-auto',
      }}
      className="h-full flex-1"
    >
      {services.length === 0 && (
        <span className="text-sm text-neutral-grey-300 text-center w-full">Không có vé khả dụng</span>
      )}
      {services
        ?.filter((service) =>
          ta ? SALE_CHANNEL_TA_CODE === service.saleChannelCode : SALE_CHANNEL_TA_CODE !== service.saleChannelCode,
        )
        ?.map((service) => (
          <KiosQuantityInput
            key={service.priceConfigId}
            name={`quantity.${service.priceConfigId}`}
            className="border border-low col-span-1 justify-between flex flex-col"
            min={0}
            max={999}
            logo={service.image}
            title={transformFullServiceName(service)}
            defaultPrice={service.price}
          />
        ))}
    </KiosSection>
  )
}

export default KiosQuatity
