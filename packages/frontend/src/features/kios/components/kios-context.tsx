import { useCustomers } from '@/lib/api/queries/customer/get-customers'
import { CustomerType, ILCCustomer } from '@/lib/api/queries/customer/schema'
import { usePaymentMethods } from '@/lib/api/queries/payment-method/get-payment-methods'
import { PaymentMethod, PaymentMethodType } from '@/lib/api/queries/payment-method/schema'
import { ILCServiceWithPrice } from '@/lib/api/queries/service/schema'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react'
import useKiosServices from '../hooks/use-kios-services'

export interface KiosContextState {
  services: ILCServiceWithPrice[]
  paymentMethods: PaymentMethod[]
  postPaidPaymentMethods: PaymentMethod[]
  isPending: boolean
  customers: ILCCustomer[]
  setIsLoadingCreatingOrder: Dispatch<SetStateAction<boolean>>
  refetchPaymentMethods: (options?: RefetchOptions) => Promise<QueryObserverResult<PaymentMethod[]>>
  isLoadingCreatingOrder: boolean
}

export const KiosContext = createContext<KiosContextState>({} as KiosContextState)

export interface KiosContextProps extends PropsWithChildren {}

const KiosContextProvider = ({ ...props }: KiosContextProps) => {
  const { data: services = [], isFetching: isServicesFetching, isLoading: isServicesLoading } = useKiosServices()

  const [isLoadingCreatingOrder, setIsLoadingCreatingOrder] = useState<boolean>(false)

  const { data: customers, isLoading: isLoadingCustomers } = useCustomers({
    variables: {
      type: CustomerType.TA,
      isActive: true,
    },
  })

  const {
    data: paymentMethods = [],
    isFetching: isPaymentMethodsFetching,
    isLoading: isPaymentMethodsLoading,
    refetch: refetchPaymentMethods,
  } = usePaymentMethods({
    variables: {
      available: true,
      type: [],
    },
    select: (resp) => resp.data || [],
  })

  const postPaidPaymentMethods =
    paymentMethods
      ?.filter((method) => method?.paymentType === PaymentMethodType.POSTPAID)
      ?.map((item) => ({
        ...item,
        bankAccounts: item?.bankAccounts?.filter((account) => account?.available) || [],
      })) || []

  const isPending =
    isServicesFetching || isServicesLoading || isPaymentMethodsFetching || isPaymentMethodsLoading || isLoadingCustomers

  const values = useMemo<KiosContextState>(
    () => ({
      services: services,
      paymentMethods: paymentMethods,
      //  paymentMethods?.filter((method) => method.paymentType !== PaymentMethodType.POSTPAID)
      postPaidPaymentMethods,
      customers: customers ?? [],
      isPending,
      isLoadingCreatingOrder,
      setIsLoadingCreatingOrder,
      refetchPaymentMethods,
    }),
    [
      services,
      paymentMethods,
      postPaidPaymentMethods,
      isPending,
      customers,
      isLoadingCreatingOrder,
      setIsLoadingCreatingOrder,
      refetchPaymentMethods,
    ],
  )

  return <KiosContext.Provider value={values}>{props.children}</KiosContext.Provider>
}

export const useKiosContext = () => {
  const ctx = useContext(KiosContext)

  if (!ctx) throw new Error('useKiosContext must be used within KiosContextProvider')

  return ctx
}

export default KiosContextProvider
