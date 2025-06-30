import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import CaretDownIcon from '@/components/widgets/icons/caret-down-icon'
import DiskIcon from '@/components/widgets/icons/disk-icon'
import PlusIcon from '@/components/widgets/icons/plus-icon'
import ReceiptIcon from '@/components/widgets/icons/receipt-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useGetSaleChannels } from '@/lib/api/queries/sale-channel/get-sale-channels'
import { useServicePriceListById } from '@/lib/api/queries/service-price-list/get-all-service-price-by-id'
import { useServicePriceList } from '@/lib/api/queries/service-price-list/get-all-service-price-list'
import { useUpdateServicePriceList } from '@/lib/api/queries/service-price-list/update-service-price-list'
import { ILocalizedText } from '@/lib/api/queries/service/types'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import ModalConfirmDeleteServicePriceList from './modal-confirm-delete-service-price-list'
import ModalCreateServicePriceList from './modal-create-service-price-list'
import SectionContainer from './section-container'
import ServicePriceList from './service-price-list'
import ServicePriceListTabsLoading from './service-price-list-tabs-loading'

export const ALL_SALE_CHANNEL_OPTION = 'all'

const ServicePriceListSection = () => {
  const isCanAccess = useCanAccess()
  const { data: servicePriceList, isLoading: isLoadingServicePriceList } = useServicePriceList()
  const queryClient = useQueryClient()
  const methods = useForm({
    defaultValues: {},
  })

  const { data: saleChannels, isLoading: isLoadingSaleChannel } = useGetSaleChannels()

  const [filterSaleChannel, setFilterSaleChannel] = useState<string>(ALL_SALE_CHANNEL_OPTION)

  const [activeTab, setActiveTab] = useState<string>()
  const [openModalCreateServicePriceList, setOpenModalCreateServicePriceList] = useState<boolean>(false)
  const { mutate: updateServicePriceList, isPending } = useUpdateServicePriceList({
    onError() {
      toastError('Cập nhật bảng giá dịch vụ thất bại')
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

      toastSuccess('Cập nhật bảng giá dịch vụ thành công')
    },
  })
  const [modalDeleteServicePriceListProps, setModalDeleteServicePriceListProps] = useState<{
    open: boolean
    servicePriceListId?: string
    servicePriceListTitle?: string
  }>({
    open: false,
  })

  const tabs = useMemo(
    () =>
      servicePriceList?.map((priceList) => ({
        title: priceList.title,
        id: priceList._id,
        content: (
          <ServicePriceList
            methods={methods}
            servicePriceListId={priceList._id}
            filterSaleChannel={filterSaleChannel}
          />
        ),
      })) ?? [],
    [servicePriceList, filterSaleChannel],
  )

  useEffect(() => {
    if (!servicePriceList) return
    setActiveTab(servicePriceList?.[0]?._id)
  }, [servicePriceList])

  const onChangeTab = (tab: { title: ILocalizedText; id: string }) => {
    setActiveTab(tab.id)
    setModalDeleteServicePriceListProps((state) => ({
      ...state,
      servicePriceListId: tab.id,
      servicePriceListTitle: tab?.title?.vi,
    }))
  }

  const onSetModalDeleteServicePriceList = (open: boolean) => {
    setModalDeleteServicePriceListProps((state) => ({ ...state, open }))
  }

  const onSumitUpdateServicePriceList = methods.handleSubmit((values: Record<string, number | string>) => {
    const ids: Record<string, number> = {}
    const serviceCodes: Record<string, string> = {}

    for (const key in values) {
      if (key.startsWith('serviceCode-')) {
        const id = key.replace('serviceCode-', '')
        if (values[key]) serviceCodes[id] = values[key] as string // type: Record<string, string>
      } else {
        if (values[key]) ids[key] = values[key] as number // type: Record<string, number>
      }
    }

    console.log(ids)
    console.log(serviceCodes)
    if (activeTab) {
      updateServicePriceList({
        servicePriceListId: activeTab,
        priceConfigs: ids,
        priceConfigServiceCodes: serviceCodes,
      })
    }
  })

  const canUpdateServicePriceList = isCanAccess(CASL_ACCESS_KEY.TICKET_UPDATE_SERVICE_PRICE_LIST)
  const canDeleteServicePriceList = isCanAccess(CASL_ACCESS_KEY.TICKET_DELETE_SERVICE_PRICE_LIST)
  const canCreateServicePriceList = isCanAccess(CASL_ACCESS_KEY.TICKET_ADD_SERVICE_PRICE_LIST)

  return (
    <SectionContainer className="flex-1 flex flex-col max-w-[calc(1200px-24px-500px)] gap-0 p-0">
      <div className="flex items-center gap-2 pb-3 px-6 pt-6">
        <ReceiptIcon />
        <h2 className="font-medium flex-1 flex items-center gap-1">
          Bảng giá dịch vụ của
          <Combobox
            options={[
              {
                value: ALL_SALE_CHANNEL_OPTION,
                label: 'Tất cả',
              },
              ...(saleChannels?.data ?? [])?.map((channel) => ({
                value: channel._id,
                label: channel.name,
              })),
            ]}
            customTriggerReactNode={(option) => {
              setFilterSaleChannel(
                option?.value === '' || option?.value === undefined || option?.value === null
                  ? ALL_SALE_CHANNEL_OPTION
                  : option?.value,
              )
              return (
                <div className="flex items-center gap-1 font-medium text-[#2970FF]">
                  {option?.label ?? 'Tất cả'}
                  <CaretDownIcon />
                </div>
              )
            }}
          />
        </h2>
        {canCreateServicePriceList && (
          <Button
            onClick={() => setOpenModalCreateServicePriceList(true)}
            className="flex items-center gap-1"
            disabled={!canCreateServicePriceList}
          >
            <PlusIcon className="[&_path]:stroke-[#fff] min-w-5 min-h-5 h-5 w-5" width={20} height={20} />
            Thêm bảng giá
          </Button>
        )}
      </div>
      <div className="flex items-center px-4 border-b-[1px] border-neutral-grey-100 gap-6 overflow-x-auto w-full h-[40px] min-h-[40px]">
        {tabs.length === 0 && (
          <span className="text-sm font-medium text-neutral-grey-300 text-center w-full">Chưa có bảng giá</span>
        )}
        {isLoadingServicePriceList ? (
          <ServicePriceListTabsLoading />
        ) : (
          tabs.map((tab) => (
            <div
              onClick={() => onChangeTab(tab)}
              key={`tab-${tab.id}`}
              className={cn(
                'text-sm font-medium text-neutral-grey-300 py-2 duration-200 transition-all hover:cursor-pointer',
                activeTab === tab.id && 'text-neutral-grey-600 border-b-[2px] border-green-500',
              )}
            >
              {tab?.title?.vi}
            </div>
          ))
        )}
      </div>
      <FormProvider {...methods}>
        <form className="w-full flex flex-col overflow-auto h-full" onSubmit={onSumitUpdateServicePriceList}>
          {tabs.find((tab) => tab.id === activeTab)?.content}

          <div className="flex gap-4 py-4 px-6 pb-6 mt-auto">
            {canDeleteServicePriceList && (
              <Button
                onClick={() => onSetModalDeleteServicePriceList(true)}
                variant="outline"
                className="text-[#DC2626] flex-1"
                type="button"
                disabled={
                  !canDeleteServicePriceList ||
                  activeTab === servicePriceList?.find((priceList) => priceList?.isDefault === true)?._id
                }
              >
                <TrashIcon className="min-w-5 min-h-5 w-5 h-5 [&_path]:stroke-[#DC2626]" />
                Xoá bảng giá
              </Button>
            )}
            {canUpdateServicePriceList && (
              <Button
                disabled={!canUpdateServicePriceList}
                isLoading={isPending}
                type="submit"
                variant="outline"
                className="flex-1"
              >
                <DiskIcon className="min-w-5 min-h-5 w-5 h-5" />
                Lưu bảng giá
              </Button>
            )}
          </div>
        </form>
      </FormProvider>

      {modalDeleteServicePriceListProps.servicePriceListId &&
        modalDeleteServicePriceListProps.servicePriceListTitle &&
        canDeleteServicePriceList && (
          <ModalConfirmDeleteServicePriceList
            open={modalDeleteServicePriceListProps.open}
            setOpen={onSetModalDeleteServicePriceList}
            servicePriceListId={modalDeleteServicePriceListProps.servicePriceListId}
            servicePriceListTitle={modalDeleteServicePriceListProps.servicePriceListTitle}
          />
        )}
      {canCreateServicePriceList && (
        <ModalCreateServicePriceList
          open={openModalCreateServicePriceList}
          setOpen={setOpenModalCreateServicePriceList}
        />
      )}
    </SectionContainer>
  )
}

export default ServicePriceListSection
