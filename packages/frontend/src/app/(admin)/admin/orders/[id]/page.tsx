import OrderDetail from "@/features/order/ui/order-detail";
import {
  getURLParamQuery,
  URLParamQueryProps,
} from "@/hooks/get-url-param-query";

export default async function Page(props: URLParamQueryProps) {
  const { params, query } = await getURLParamQuery(props);

  return <OrderDetail params={params} query={query} />;
}
