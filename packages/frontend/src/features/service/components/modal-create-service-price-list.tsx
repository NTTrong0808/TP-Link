import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useCreateServicePriceList } from '@/lib/api/queries/service-price-list/create-service-price-list'
import { useServicePriceListById } from '@/lib/api/queries/service-price-list/get-all-service-price-by-id'
import { useServicePriceList } from '@/lib/api/queries/service-price-list/get-all-service-price-list'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export type TBaseServicePriceList = 'existedServicePriceList' | 'default'

export const schema = z.object({
  titleVI: z.string({ message: 'Vui lòng nhập tên bảng giá tiếng việt' }),
  titleEN: z.string({ message: 'Vui lòng nhập tên bảng giá tiếng anh' }),
  baseServicePriceListId: z.string().optional(),
  baseServicePriceListType: z.string().optional(),
})

const ModalCreateServicePriceList = ({ open, setOpen }: Props) => {
  const queryClient = useQueryClient()
  const { data: servicePriceList, isLoading } = useServicePriceList()
  const { mutate: createServicePriceList, isPending } = useCreateServicePriceList({
    onError() {
      toastError('Tạo bảng giá dịch vụ thất bại')
    },
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: useServicePriceList.getKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: useServicePriceListById.getKey(),
        }),
      ])

      toastSuccess('Tạo bảng giá dịch vụ thành công')
      setOpen(false)
    },
  })
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      baseServicePriceListType: 'default',
    },
  })

  const baseServicePriceListType = methods.watch('baseServicePriceListType')

  const handleChangeBaseServicePriceListType = (base: TBaseServicePriceList) => {
    methods.setValue('baseServicePriceListType', base)
  }

  const handleSubmit = methods.handleSubmit((values) => {
    createServicePriceList({
      dto: {
        title: {
          vi: values.titleVI,
          en: values.titleEN,
        },
        ...(values?.baseServicePriceListType
          ? { baseServicePriceListType: 'default' }
          : { baseServicePriceListType: values.baseServicePriceListType }),
      },
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTitle className="hidden" />
      <DialogContent className="bg-white p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <span className="font-medium">Thêm bảng giá dịch vụ </span>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Field size="sm" label="Tên bảng giá" component="text" name="titleVI" placeholder="Tiếng việt" />
                <Field size="sm" component="text" name="titleEN" placeholder="Tiếng anh" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="field-label text-sm font-normal text-neutral-grey-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
                  Dữ liệu{' '}
                </span>
                <RadioGroup
                  onValueChange={handleChangeBaseServicePriceListType}
                  defaultValue={baseServicePriceListType}
                >
                  <label
                    htmlFor="default"
                    className="flex items-center gap-2 px-4 py-3 rounded-md border-[1px] border-[#EAEAEA] hover:cursor-pointer"
                  >
                    <RadioGroupItem value="default" id="default" /> <span>Thêm mới với giá mặc định</span>
                  </label>

                  <label
                    htmlFor="existedServicePriceList"
                    className="flex items-center gap-2 px-4 py-3 rounded-md border-[1px] border-[#EAEAEA] hover:cursor-pointer"
                  >
                    <RadioGroupItem value="existedServicePriceList" id="existedServicePriceList" />{' '}
                    <span>Thêm mới từ bảng giá có sẵn</span>
                  </label>
                </RadioGroup>
              </div>

              {baseServicePriceListType === 'existedServicePriceList' && (
                <Field
                  component="select"
                  name="baseServicePriceListId"
                  disabled={isLoading}
                  placeholder="Chọn bảng giá"
                  options={
                    servicePriceList
                      ?.filter((e) => !e?.isDefault)
                      ?.map((e) => ({
                        label: e?.title?.vi,
                        value: e._id,
                      })) ?? []
                  }
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Rời trang
              </Button>
              <Button disabled={isPending} type="submit">
                Tạo mới
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ModalCreateServicePriceList
