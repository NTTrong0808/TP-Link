import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { consumerApi } from "../..";
import { ApiResponse } from "../../schema";
import { SaleChannel } from "./types";

export interface Variables {
  saleChannelId: string;
  isActive?: boolean;
}

export interface Response extends ApiResponse<SaleChannel> {}

export interface Error extends AxiosError<Response> {}

export const changeActiveSaleChannel = async (
  variables?: Variables
): Promise<Response> => {
  const response = await consumerApi.patch<Response>(
    `/sale-channels/${variables?.saleChannelId}/change-active`,
    {
      isActive: variables?.isActive,
    }
  );
  return response.data;
};

export const changeActiveSaleChannelKey = changeActiveSaleChannel.name;

export const useChangeActiveSaleChannel = createMutation<
  Response,
  Variables,
  any
>({
  mutationKey: [changeActiveSaleChannelKey],
  mutationFn: changeActiveSaleChannel,
});
