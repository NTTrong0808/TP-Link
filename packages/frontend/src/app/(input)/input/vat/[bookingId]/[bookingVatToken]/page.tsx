import InputVat from '@/features/input/vat/ui'
import { getURLParamQuery, URLParamQueryProps } from '@/hooks/get-url-param-query'

const Page = async (props: URLParamQueryProps) => {
  const { params, query } = await getURLParamQuery(props)

  return <InputVat bookingId={params?.bookingId as string} bookingVatToken={params?.bookingVatToken as string} />
}

export default Page
