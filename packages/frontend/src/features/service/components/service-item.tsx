import { Switch } from '@/components/ui/switch'
import EditIcon from '@/components/widgets/icons/edit-icon'
import SixDotsVerticalIcon from '@/components/widgets/icons/six-dots-vertical-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import { toastSuccess } from '@/components/widgets/toast'
import { useDisableOrEnableService } from '@/lib/api/queries/service/disable-or-enable-service'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { ILCService } from '@/lib/api/queries/service/schema'
import { ServiceType } from '@/lib/api/queries/service/types'
import { useGetMediaFile } from '@/lib/api/queries/upload/queries/use-get-media-file'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  service: ILCService
  onUpdateService: (serviceId: string) => void
  onDisableService: (serviceId: string, serviceShortTitle: string) => void
  onDeleteService: (serviceId: string, serviceShortTitle: string) => void
}
const ServiceItem = ({ service, onUpdateService, onDisableService, onDeleteService }: Props) => {
  const isCanAccess = useCanAccess()
  const queryClient = useQueryClient()
  const { mutate: disableOrEnableService, isPending } = useDisableOrEnableService({
    onError() {},
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: useServices.getKey() })
      toastSuccess('Kích hoạt dịch vụ thành công')
    },
  })

  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
    id: service?._id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const onSwitch = () => {
    if (service.isActive) {
      onDisableService(service._id, service.title.vi)
      return
    }
    disableOrEnableService({ serviceId: service._id, isActive: true })
  }

  const ServiceImageMemo = useMemo(() => <ServiceImage image={service?.image} />, [service?.image])

  const canUpdateService = isCanAccess(CASL_ACCESS_KEY.TICKET_UPDATE_SERVICE)
  const canDeleteService = isCanAccess(CASL_ACCESS_KEY.TICKET_DELETE_SERVICE)
  const canDisableAndEnableService = isCanAccess(CASL_ACCESS_KEY.TICKET_DISABLE_AND_ENABLE_SERVICE)

  return (
    <div ref={setNodeRef} style={style} className="p-3 bg-[#F5F5F5] flex items-center gap-1 rounded-lg w-full">
      <SixDotsVerticalIcon {...attributes} {...listeners} className="outline-none" />
      <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center">{ServiceImageMemo}</div>
      <div className="flex flex-col flex-1">
        <span className="text-xs font-semibold text-[#B85208]">
          {service?.type === ServiceType.SINGLE_SERVICE ? 'Dịch vụ lẻ' : 'Gói dịch vụ'}
        </span>
        <span className="font-medium">{service?.title?.vi}</span>
        {/* <span className="text-xs text-secondary-foreground">{service?.shortTitle?.vi}</span> */}
      </div>
      <div className="flex items-center gap-2">
        {canUpdateService && (
          <EditIcon
            onClick={() => onUpdateService(service?._id)}
            className={cn(canUpdateService ? 'cursor-pointe' : 'opacity-50 cursor-not-allowed')}
          />
        )}
        {canDeleteService && (
          <TrashIcon
            onClick={() => onDeleteService(service?._id, service.title.vi)}
            className={cn(canDeleteService ? 'cursor-pointe' : 'opacity-50 cursor-not-allowed')}
          />
        )}
        {canDisableAndEnableService && (
          <Switch checked={service.isActive} onClick={onSwitch} disabled={!canDisableAndEnableService || isPending} />
        )}
      </div>
    </div>
  )
}

export default ServiceItem

type ServiceImageProps = {
  image: string
}
const ServiceImage = ({ image }: ServiceImageProps) => {
  const { mutateAsync: getMediaFIle, isPending } = useGetMediaFile()
  const [previewImage, setPreviewImage] = useState<string>()

  useEffect(() => {
    if (!image) return
    getMediaFIle({
      mediaId: image,
    }).then((value) => {
      if (value?.data?.previewURL) setPreviewImage(value?.data?.previewURL)
    })
  }, [image])

  return (
    <Image
      alt="serviceIcon"
      src={previewImage ?? 'https://www.discountflooringsupplies.com.au/wp-content/uploads/blank-img.jpg'}
      width={24}
      height={24}
      objectFit="cover"
      className="w-6 h-6 min-w-6 min-h-6 object-cover rounded-sm"
    />
  )
}
