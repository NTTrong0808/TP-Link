/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/form'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useServicePriceListById } from '@/lib/api/queries/service-price-list/get-all-service-price-by-id'
import { useServices } from '@/lib/api/queries/service/get-all-services'
import { useServiceById } from '@/lib/api/queries/service/get-service'
import { ServiceType } from '@/lib/api/queries/service/types'
import { useUpdateService } from '@/lib/api/queries/service/update-service'
import { useUploadFiles } from '@/lib/api/queries/upload/queries/use-upload-files-for-partner'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import UploadImageInUpdate from './upload-image-in-update'
import { Combobox } from '@/components/ui/combobox'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

const numOfUseOptions = [
  { value: '-1', label: 'Không giới hạn' },
  { value: '1', label: '01 lượt' },
  { value: '2', label: '02 lượt' },
  { value: '3', label: '03 lượt' },
  { value: '4', label: '04 lượt' },
  { value: '5', label: '05 lượt' },
]

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  serviceId: string
}

export const schema = z.object({
  type: z.string().optional(),
  childServiceIds: z.array(z.any()).optional(),
  titleVI: z.string({ message: 'Vui lòng điền tên tiếng việt' }),
  titleEN: z.string({ message: 'Vui lòng điền tên tiếng việt' }),
  shortTitleVI: z.string({ message: 'Vui lòng điền tên ngắn gọn tiếng việt' }),
  shortTitleEN: z.string({ message: 'Vui lòng điền tên ngắn gọn tiếng anh' }),
  invoiceUnit: z.string({ message: 'Vui lòng nhập giá mặc định' }),
  descriptionVI: z
    .string({ message: 'Vui lòng điền mô tả tiếng việt' })
    .min(1, { message: 'Vui lòng điền mô tả tiếng việt' }),
  descriptionEN: z
    .string({ message: 'Vui lòng điền mô tả tiếng anh' })
    .min(1, { message: 'Vui lòng điền mô tả tiếng anh' }),
  note: z.string().optional(),
})

const ModalUpdateService = ({ serviceId, open, setOpen }: Props) => {
  const { data: service, isLoading } = useServiceById({
    variables: {
      serviceId,
    },
  })

  const [serviceImage, setServiceImage] = useState<File | string>()
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.SINGLE_SERVICE)
  const { data: services, isLoading: isLoadingServices } = useServices({
    variables: {
      type: ServiceType.SINGLE_SERVICE,
    },
    enabled: serviceType === ServiceType.PACKAGE_SERVICE,
  })
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadFiles()
  const [childServices, setChildServices] = useState<
    { id: string; serviceId: string | null; numOfUses: number | null }[]
  >([])

  const queryClient = useQueryClient()

  const { mutate: updateService, isPending } = useUpdateService({
    onError() {
      toastError('Cập nhật dịch vụ thất bại')
    },
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: useServices.getKey() }),
        queryClient.invalidateQueries({
          queryKey: useServicePriceListById.getKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: useServiceById.getKey(),
        }),
      ])

      toastSuccess('Cập nhật dịch vụ thành công')
      setOpen(false)
    },
  })
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceUnit: 'Gói',
    },
  })

  const isValidChildService = (service: { serviceId: string | null; numOfUses: number | null }) => {
    if (!service.serviceId || !service.numOfUses) {
      return false
    }
    return true
  }

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (childServices.some((service) => !isValidChildService(service))) {
      toast.error('Thông tin dịch vụ lẻ không hợp lệ, vui lòng kiểm tra lại', { position: 'top-right' })
      return
    }

    let newServiceImage: string | null = null
    if (serviceImage) {
      if (typeof serviceImage === 'string') {
        newServiceImage = serviceImage
      } else {
        const media = await uploadImage({
          files: [serviceImage],
        })
        newServiceImage = media?.data?.mediaIds?.[0]
      }
    }
    updateService({
      serviceId,
      dto: {
        image: newServiceImage ?? undefined,
        title: {
          vi: values.titleVI,
          en: values.titleEN,
        },
        shortTitle: {
          vi: values.shortTitleVI,
          en: values.shortTitleEN,
        },
        invoiceUnit: values.invoiceUnit,
        description: {
          vi: values.descriptionVI,
          en: values.descriptionEN,
        },
        note: values.note,
        type: methods.getValues('type') as ServiceType,
        childServiceIds: childServices?.map((e) => e?.serviceId!) ?? undefined,
        childServiceNumOfUses: childServices?.reduce(
          (obj, service) => ({
            ...obj,
            [service.serviceId!]: service.numOfUses,
          }),
          {},
        ),
      },
    })
  })

  useEffect(() => {
    if (!service) return
    if (!services) return
    methods.setValue(
      'childServiceIds',
      service?.childServiceIds?.map((serviceId) => ({
        label: services?.find((service) => service?._id === serviceId)?.shortTitle?.vi,
        value: serviceId,
      })) ?? undefined,
    )
  }, [service, services])

  useEffect(() => {
    if (!service) return
    console.log('here')
    methods.setValue('titleVI', service.title.vi)
    methods.setValue('titleEN', service.title.en)
    methods.setValue('shortTitleVI', service.shortTitle.vi)
    methods.setValue('shortTitleEN', service.shortTitle.en)
    methods.setValue('invoiceUnit', service.invoiceUnit)
    methods.setValue('descriptionVI', service?.description?.vi ?? '')
    methods.setValue('descriptionEN', service?.description?.en ?? '')
    methods.setValue('note', service.note)
    methods.setValue('type', service.type)
    setChildServices(
      (service.childServiceIds ?? []).map((_service) => ({
        id: uuidv4(),
        serviceId: _service,
        numOfUses: service.childServiceNumOfUses[_service],
      })),
    )
    setServiceType((service.type as ServiceType) ?? ServiceType.SINGLE_SERVICE)
  }, [service])

  const handleChangeServiceType = (type: ServiceType) => {
    setServiceType(type)
    methods.setValue('type', type)
  }

  const UploadImageInUpdateMemo = useMemo(
    () => <UploadImageInUpdate onChangeFileImage={setServiceImage} image={service?.image} />,
    [service?.image],
  )

  const handleAddService = () => {
    setChildServices((state) => [...state, { serviceId: null, numOfUses: null, id: uuidv4() }])
  }

  const handleRemoveService = (id: string) => {
    setChildServices((state) => {
      const temp = [...state]
      const index = temp.findIndex((e) => e.id === id)

      if (index !== -1) {
        temp.splice(index, 1)
      }

      return temp
    })
  }

  const handleChangeService = (
    id: string,
    dto: {
      serviceId?: string | null
      numOfUses?: number | null
    },
  ) => {
    setChildServices((state) => {
      const temp = [...state]
      const index = temp.findIndex((e) => e.id === id)

      temp[index] = {
        ...temp[index],
        ...dto,
      }
      return temp
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-h-[700px]">
            <span className="font-medium">Chỉnh sửa dịch vụ</span>
            {isLoading || isLoadingServices ? (
              <div className="w-full h-[488px] flex items-center justify-center">
                <Loader2 className=" animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-1 overflow-auto">
                <div className="flex gap-2">
                  <div
                    onClick={() => handleChangeServiceType(ServiceType.SINGLE_SERVICE)}
                    className={cn(
                      'px-3 py-2 border-[1px] border-[#EAEAEA] bg-white rounded-md font-medium text-[#616161] hover:cursor-pointer transition-all duration-200',
                      ServiceType.SINGLE_SERVICE === serviceType && 'border-green-500 text-green-500 bg-green-50',
                    )}
                  >
                    Dịch vụ lẻ
                  </div>
                  <div
                    className={cn(
                      'px-3 py-2 border-[1px] border-[#EAEAEA] bg-white rounded-md font-medium text-[#616161] hover:cursor-pointer transition-all duration-200',
                      ServiceType.PACKAGE_SERVICE === serviceType && 'border-green-500 text-green-500 bg-green-50',
                    )}
                    onClick={() => handleChangeServiceType(ServiceType.PACKAGE_SERVICE)}
                  >
                    Gói dịch vụ
                  </div>
                </div>
                {UploadImageInUpdateMemo}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-grey-500">Tên dịch vụ</label>
                  <div className="flex items-center">
                    <div className="w-[100px] px-2 text-xs text-neutral-grey-500 italic">Tiếng Việt</div>
                    <Field size="sm" component="text" name="titleVI" placeholder="Tên dịch vụ Tiếng Việt" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-[100px] px-2 text-xs text-neutral-grey-500 italic">Tiếng Anh</div>
                    <Field size="sm" component="text" name="titleEN" placeholder="Tên dịch vụ Tiếng Anh" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-grey-500">Tên ngắn gọn</label>
                  <div className="flex items-center">
                    <div className="w-[100px] px-2 text-xs text-neutral-grey-500 italic">Tiếng Việt</div>
                    <Field size="sm" component="text" name="shortTitleVI" placeholder="Tên ngắn gọn Tiếng Việt" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-[100px] px-2 text-xs text-neutral-grey-500 italic">Tiếng Anh</div>
                    <Field size="sm" component="text" name="shortTitleEN" placeholder="Tên ngắn gọn Tiếng Anh" />
                  </div>
                </div>

                {serviceType === ServiceType.PACKAGE_SERVICE && (
                  <div className="flex flex-col gap-1">
                    <div className="flex w-full items-center justify-between pb-1">
                      <label className="text-xs text-neutral-grey-500">Các gói dịch vụ lẻ</label>
                      <div
                        onClick={handleAddService}
                        className="hover:cursor-pointer p-[6px] rounded-md border border-[#EAEAEA]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 5V10M10 10V15M10 10H15M10 10H5"
                            stroke="#A7A7A7"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    {childServices.length === 0 && (
                      <span className="w-full text-center  text-xs text-neutral-grey-500 italic">
                        Chưa có dịch vụ lẻ
                      </span>
                    )}
                    {childServices.map((child) => (
                      <div key={`child-service-${child.id}`} className="flex items-center gap-2 pl-2">
                        <span className="whitespace-nowrap text-xs text-neutral-grey-500 italic">Dịch vụ lẻ</span>
                        <Combobox
                          disabled={isLoadingServices}
                          placeholder="Chọn dịch vụ"
                          value={child.serviceId}
                          options={(services ?? [])?.map((service) => ({
                            label: service?.shortTitle?.vi,
                            value: service?._id,
                          }))}
                          onChange={(value) =>
                            handleChangeService(child.id, {
                              serviceId: value ?? null,
                            })
                          }
                        />
                        <span className="whitespace-nowrap text-xs text-neutral-grey-500 italic">Số lượt</span>
                        <Combobox
                          placeholder="Lượt"
                          options={numOfUseOptions}
                          value={child.numOfUses ? child.numOfUses.toString() : ''}
                          onChange={(value) =>
                            handleChangeService(child.id, {
                              numOfUses: value ? Number(value) : null,
                            })
                          }
                        />
                        <div
                          onClick={() => handleRemoveService(child.id)}
                          className="hover:cursor-pointer p-[6px] rounded-md border border-[#EAEAEA]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M8.3335 9.16667V14.1667M11.6668 9.16667V14.1667M3.3335 5.83333H16.6668M15.8335 5.83333L15.111 15.9517C15.0811 16.3722 14.8929 16.7657 14.5844 17.053C14.2759 17.3403 13.87 17.5 13.4485 17.5H6.55183C6.13028 17.5 5.72439 17.3403 5.4159 17.053C5.10742 16.7657 4.91926 16.3722 4.88933 15.9517L4.16683 5.83333H15.8335ZM12.5002 5.83333V3.33333C12.5002 3.11232 12.4124 2.90036 12.2561 2.74408C12.0998 2.5878 11.8878 2.5 11.6668 2.5H8.3335C8.11248 2.5 7.90052 2.5878 7.74424 2.74408C7.58796 2.90036 7.50016 3.11232 7.50016 3.33333V5.83333H12.5002Z"
                              stroke="#A7A7A7"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Field size="sm" label="Đơn vị tính" component="text" name="invoiceUnit" />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-grey-500">Mô tả</label>
                  <div className="flex items-center">
                    <div className="w-[100px] px-2 text-xs text-neutral-grey-500 italic">Tiếng Việt</div>
                    <Field component="textarea" name="descriptionVI" placeholder="Mô tả dịch vụ Tiếng Việt" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-[100px] px-2 text-xs text-neutral-grey-500 italic">Tiếng Anh</div>
                    <Field component="textarea" name="descriptionEN" placeholder="Mô tả dịch vụ Tiếng Anh" />
                  </div>
                </div>
                <Field label="Lưu ý" component="textarea" name="note" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Rời trang
              </Button>
              <Button type="submit" disabled={isPending || isUploading} isLoading={isPending || isUploading}>
                Cập nhật
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ModalUpdateService
