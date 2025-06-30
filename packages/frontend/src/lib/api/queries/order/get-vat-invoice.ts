import { AxiosError, AxiosRequestConfig } from "axios";
import { createMutation } from "react-query-kit";
import { consumerApi } from "../..";
import { ApiResponse } from "../../schema";

export interface Variables {
  bookingId: string;
}

export interface Response extends ApiResponse<Blob> {}

export interface Error extends AxiosError<Response> {}

export const getVatInvoice = async (
  variables: Variables,
  config?: AxiosRequestConfig
): Promise<Blob> => {
  const response = await consumerApi.get<Blob>(
    `/bookings/vat-invoice/${variables.bookingId}`,
    {
      ...config,
      responseType: "blob",
    }
  );
  return response.data;
};

export const getVatInvoiceKey = getVatInvoice.name;

export const useGetVatInvoiceMutation = createMutation<Blob, Variables, Error>({
  mutationKey: [getVatInvoiceKey],
  mutationFn: getVatInvoice,
});
