'use client'

import { toastError, toastSuccess } from '@/components/widgets/toast'
import {
  ConfigurationContent,
  ConfigurationHeader,
  ConfigurationItem,
  ConfigurationItemGroup,
  ConfigurationSection,
} from '@/features/configuration/components/configuration'
import { useGetSaleChannels } from '@/lib/api/queries/sale-channel/get-sale-channels'
import type { SaleChannel } from '@/lib/api/queries/sale-channel/types'
import { GroupSaleChannel, GroupSaleChannelLabel } from '@/lib/api/queries/sale-channel/types'
import { useUpdateSaleChannel } from '@/lib/api/queries/sale-channel/use-update-sale-channel'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useQueryClient } from '@tanstack/react-query'
import { ComponentProps, Fragment } from 'react'

const SaleChannel = ({ className, ...props }: ComponentProps<'section'>) => {
  const { data: services, isLoading: isLoadingService } = useServices()
  const canAccess = useCanAccess()

  const isCanToggleSaleChannel = canAccess(CASL_ACCESS_KEY.TICKET_SALE_CHANNEL_TOGGLE)

  const { data: saleChannels, refetch } = useGetSaleChannels({
    select: (resp) =>
      resp.data.reduce((acc, curr) => {
        acc[curr.groupSaleChannel] = acc[curr.groupSaleChannel] || []
        acc[curr.groupSaleChannel].push(curr)
        return acc
      }, {} as Record<GroupSaleChannel, SaleChannel[]>),
  })

  const { mutateAsync: changeActiveSaleChannel } = useUpdateSaleChannel()

  const queryClient = useQueryClient()
  const { mutate: updateSaleChannel, isPending: isLoadingChange } = useUpdateSaleChannel({
    onSuccess() {
      toastSuccess('Cập nhật thành công')
      queryClient.invalidateQueries({
        queryKey: useGetSaleChannels.getKey(),
      })
    },
  })

  const handleClick = (saleChannelId: string, checked?: boolean) =>
    changeActiveSaleChannel({
      saleChannelId,
      isActive: checked,
    })
      .then(() => {
        toastSuccess('Cập nhật thành công')
        refetch()
      })
      .catch((error) => {
        toastError(error)
      })

  const handleChangeSwitch = ({
    checked,
    saleChannelId,
    serviceId,
    saleChannelServices,
  }: {
    checked: boolean
    saleChannelId: string
    serviceId: string
    saleChannelServices: string[]
  }) => {
    if (checked) {
      updateSaleChannel({
        saleChannelId,
        services: [...saleChannelServices, serviceId],
      })
    } else {
      updateSaleChannel({
        saleChannelId,
        services: saleChannelServices.filter((_service) => _service !== serviceId),
      })
    }
  }

  return (
    <ConfigurationSection id="sale-channel">
      <ConfigurationContent>
        {saleChannels &&
          Object.keys(saleChannels).map((groupSaleChannel) => (
            <Fragment key={groupSaleChannel}>
              <ConfigurationHeader>{GroupSaleChannelLabel[groupSaleChannel as GroupSaleChannel]}</ConfigurationHeader>
              {saleChannels[groupSaleChannel as GroupSaleChannel].map((saleChannel) => (
                <ConfigurationItemGroup
                  key={saleChannel._id}
                  title={saleChannel.name}
                  defaultChecked={saleChannel.isActive}
                  toggleable
                  onCheckedChange={(checked) => handleClick(saleChannel?._id, checked)}
                >
                  {services?.map((service) => (
                    <ConfigurationItem
                      key={service?._id}
                      imageId={service?.image}
                      title={service?.title?.vi}
                      defaultChecked={saleChannel?.services.includes(service?._id)}
                      toggleable={isCanToggleSaleChannel}
                      onCheckedChange={(checked) =>
                        handleChangeSwitch({
                          checked,
                          saleChannelId: saleChannel?._id,
                          serviceId: service?._id,
                          saleChannelServices: saleChannel?.services,
                        })
                      }
                    />
                  ))}
                </ConfigurationItemGroup>
              ))}
            </Fragment>
          ))}
      </ConfigurationContent>
    </ConfigurationSection>
  )
}

export default SaleChannel
