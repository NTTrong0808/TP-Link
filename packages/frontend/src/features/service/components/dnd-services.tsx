import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useArrangeServices } from '@/lib/api/queries/service/arrange-services'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { ILCService } from '@/lib/api/queries/service/schema'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import ServiceItem from './service-item'
import ServiceLoading from './services-loading'

type Props = {
  onUpdateService: (serviceId: string) => void
  onDisableService: (serviceId: string, serviceShortTitle: string) => void
  onDeleteService: (serviceId: string, serviceShortTitle: string) => void
}

const DndServices = ({ onUpdateService, onDisableService, onDeleteService }: Props) => {
  const { data: servicesRes, isLoading } = useServices()
  const services = servicesRes ?? []
  const queryClient = useQueryClient()

  const { mutate: arrangeServices, isPending } = useArrangeServices({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: useServices.getKey(),
      })
      toastSuccess('Sắp xếp thành công')
    },
    onError() {
      toastError('Sắp xếp thất bại')
    },
  })
  const [mappedServices, setMappedServices] = useState<(ILCService & { id: string })[]>(
    services.map((service) => ({
      ...service,
      id: service._id,
    })),
  )

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    const overIndex = mappedServices.findIndex((item) => item.id === over?.id)
    const activeIndex = mappedServices.findIndex((item) => item.id === active?.id)

    const sortedItems = arrayMove(mappedServices, activeIndex, overIndex)

    setMappedServices(sortedItems)
    arrangeServices({
      positions: sortedItems.map((item, index) => ({
        serviceId: item._id,
        position: index + 1,
      })),
    })
    // onSorted?.(sortedItems.map((item) => omit(item, ["id"])));
  }

  useEffect(() => {
    if (!services || services.length === 0) return
    setMappedServices(
      services.map((service) => ({
        ...service,
        id: service._id,
      })),
    )
  }, [services])

  if (services.length === 0) {
    return <span className="text-sm font-medium text-neutral-grey-300 text-center">Chưa có dịch vụ</span>
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {isLoading || isPending ? (
        <ServiceLoading />
      ) : (
        <SortableContext items={mappedServices} strategy={verticalListSortingStrategy}>
          {mappedServices.map((service) => (
            <ServiceItem
              service={service}
              key={`service-item-${service?.id}`}
              onUpdateService={onUpdateService}
              onDisableService={onDisableService}
              onDeleteService={onDeleteService}
            />
          ))}
        </SortableContext>
      )}
    </DndContext>
  )
}

export default DndServices
