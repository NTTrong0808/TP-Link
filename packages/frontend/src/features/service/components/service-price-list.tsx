import { useServicePriceListById } from '@/lib/api/queries/service-price-list/get-all-service-price-by-id'
import SaleChannelServices from './sale-channel-services'
import ServicePriceListLoading from './service-price-list-loading'
import { ALL_SALE_CHANNEL_OPTION } from './service-price-list-section'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { IPriceConfig } from '@/lib/api/queries/service-price-list/types'

type Props = {
  methods: UseFormReturn<any, any, any>
  servicePriceListId: string
  filterSaleChannel: string
}

const ServicePriceList = ({ methods, servicePriceListId, filterSaleChannel }: Props) => {
  const { data: servicePriceList, isLoading } = useServicePriceListById({
    variables: {
      servicePriceListId,
    },
  })

  useEffect(() => {
    if (!servicePriceList) return
    servicePriceList.saleChannelPriceConfigs.forEach((configs) =>
      configs.groupPriceConfigs
        ?.reduce((configs: IPriceConfig[], group) => [...configs, ...group?.priceConfigs], [])
        .forEach((config) => {
          methods.setValue(config.id as never, config.price as never)
          methods.setValue(`serviceCode-${config.id}` as never, config.serviceCode as never)
        }),
    )
  }, [servicePriceList])

  return (
    <div className="flex flex-col gap-4 w-full overflow-auto p-6 flex-1">
      {servicePriceList?.saleChannelPriceConfigs?.length === 0 && (
        <span className="text-sm font-medium text-neutral-grey-300 text-center w-full mt-4">Chưa có dịch vụ</span>
      )}
      {isLoading ? (
        <ServicePriceListLoading />
      ) : (
        servicePriceList?.saleChannelPriceConfigs
          ?.filter((config) =>
            filterSaleChannel === ALL_SALE_CHANNEL_OPTION ? true : config.saleChannelId === filterSaleChannel,
          )
          ?.map((saleChannelPriceConfig) => (
            <SaleChannelServices
              saleChannelId={saleChannelPriceConfig.saleChannelId}
              saleChannelName={saleChannelPriceConfig.saleChannelName}
              groupPriceConfigs={saleChannelPriceConfig.groupPriceConfigs}
              isActive={saleChannelPriceConfig.isActive}
              key={`channel-${saleChannelPriceConfig.saleChannelId}`}
            />
          ))
      )}
    </div>
  )
}

export default ServicePriceList
