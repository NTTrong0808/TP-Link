import { Button } from '@/components/ui/button'
import ListIcon from '@/components/widgets/icons/list-icon'
import PlusIcon from '@/components/widgets/icons/plus-icon'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useState } from 'react'
import DndServices from './dnd-services'
import ModalConfirmDeleteService from './modal-confirm-delete-service'
import ModalConfirmDisableService from './modal-confirm-disable-service'
import ModalCreateService from './modal-create-service'
import ModalUpdateService from './modal-update-service'
import SectionContainer from './section-container'

const ServiceSection = () => {
  const isCanAccess = useCanAccess()
  const [openModalCreateService, setOpenModalCreateService] = useState<boolean>(false)

  const [modalCreateServiceProps, setModalCreateServiceProps] = useState<{
    open: boolean
    serviceId?: string
  }>({ open: false })

  const [modalDisableServiceProps, setModalDisableServiceProps] = useState<{
    open: boolean
    serviceId?: string
    serviceShortTitle?: string
  }>({ open: false })

  const [modalDeleteServiceProps, setModalDeleteServiceProps] = useState<{
    open: boolean
    serviceId?: string
    serviceShortTitle?: string
  }>({ open: false })

  const setModalUpdateOpenState = (open: boolean) => {
    setModalCreateServiceProps((state) => ({ ...state, open }))
  }

  const onUpdateService = (serviceId: string) => {
    setModalCreateServiceProps({
      serviceId,
      open: true,
    })
  }

  const setModalDisableOpenState = (open: boolean) => {
    setModalDisableServiceProps((state) => ({ ...state, open }))
  }

  const onDisableService = (serviceId: string, serviceShortTitle: string) => {
    setModalDisableServiceProps({
      serviceId,
      open: true,
      serviceShortTitle,
    })
  }

  const setModalDeleteOpenState = (open: boolean) => {
    setModalDeleteServiceProps((state) => ({ ...state, open }))
  }

  const onDeleteService = (serviceId: string, serviceShortTitle: string) => {
    setModalDeleteServiceProps({
      serviceId,
      open: true,
      serviceShortTitle,
    })
  }

  const canAddService = isCanAccess(CASL_ACCESS_KEY.TICKET_ADD_SERVICE)
  const canUpdateService = isCanAccess(CASL_ACCESS_KEY.TICKET_UPDATE_SERVICE)
  const canDisableAndEnableService = isCanAccess(CASL_ACCESS_KEY.TICKET_DISABLE_AND_ENABLE_SERVICE)
  const canDeleteService = isCanAccess(CASL_ACCESS_KEY.TICKET_DELETE_SERVICE)
  return (
    <SectionContainer className="max-w-[500px] h-full">
      <div className="flex items-center gap-2">
        <ListIcon />
        <h2 className="font-medium">Quản lí dịch vụ</h2>
      </div>
      <div className="flex-1 h-full flex flex-col gap-6 overflow-auto">
        <DndServices
          onUpdateService={onUpdateService}
          onDisableService={onDisableService}
          onDeleteService={onDeleteService}
        />
      </div>

      {canAddService && (
        <Button
          className="flex items-center gap-1 w-full"
          variant="outline"
          onClick={() => setOpenModalCreateService(true)}
          disabled={!canAddService}
        >
          <PlusIcon />
          Thêm dịch vụ
        </Button>
      )}
      <ModalCreateService open={openModalCreateService} setOpen={setOpenModalCreateService} />
      {modalCreateServiceProps.serviceId && (
        <ModalUpdateService
          serviceId={modalCreateServiceProps.serviceId}
          open={modalCreateServiceProps.open}
          setOpen={setModalUpdateOpenState}
        />
      )}
      {modalDisableServiceProps.serviceId &&
        modalDisableServiceProps.serviceShortTitle &&
        canDisableAndEnableService && (
          <ModalConfirmDisableService
            serviceId={modalDisableServiceProps.serviceId}
            serviceShortTitle={modalDisableServiceProps.serviceShortTitle}
            open={modalDisableServiceProps.open}
            setOpen={setModalDisableOpenState}
          />
        )}
      {modalDeleteServiceProps.serviceId && modalDeleteServiceProps.serviceShortTitle && canDeleteService && (
        <ModalConfirmDeleteService
          serviceId={modalDeleteServiceProps.serviceId}
          serviceShortTitle={modalDeleteServiceProps.serviceShortTitle}
          open={modalDeleteServiceProps.open}
          setOpen={setModalDeleteOpenState}
        />
      )}
    </SectionContainer>
  )
}

export default ServiceSection
