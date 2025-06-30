import { consumerApi } from "@/lib/api";
import { ApiResponse } from "@/lib/api/schema";
import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { BookingWithPaymentMethodName } from "./schema";

export interface Variables {
  size?: number;
  page?: number;
  taId: string;
  paymentMethodId?: string[];
  status?: string[];
  vat?: string[];
  totalPaidFrom?: string | null;
  totalPaidTo?: string | null;
}

export interface Response extends ApiResponse<BookingWithPaymentMethodName[]> {}

export interface Error extends AxiosError<Response> {}

export const getBookings = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>("/bookings", {
    params: {
      size: variables?.size || 25,
      page: variables?.page || 0,
      taId: variables?.taId,
      totalPaidTo:
        variables?.totalPaidTo && variables?.totalPaidFrom !== ""
          ? Number(variables?.totalPaidTo)
          : undefined,
      totalPaidFrom:
        variables?.totalPaidFrom && variables?.totalPaidFrom !== ""
          ? Number(variables?.totalPaidFrom)
          : undefined,
      status:
        variables?.status && variables?.status?.length !== 0
          ? variables.status.join(",")
          : undefined,
      paymentMethodId:
        variables?.paymentMethodId && variables?.paymentMethodId?.length !== 0
          ? variables.paymentMethodId.join(",")
          : undefined,
      vat:
        variables?.vat && variables?.paymentMethodId?.length !== 0
          ? variables.vat.join(",")
          : undefined,
    },
  });

  return response.data;
};

export const getBookingsKey = getBookings.name;

export const useBookings = createQuery<Response, Variables, any>({
  queryKey: [getBookingsKey],
  fetcher: getBookings,
});
