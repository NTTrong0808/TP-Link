import { downloadExcel } from "@/helper/excel";
import { appDayJs } from "@/utils/dayjs";
import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { consumerApi } from "../..";
import { GetCustomerVariables } from "./schema";

export interface Variables extends GetCustomerVariables {}

export interface Response extends Blob {}

export interface Error extends AxiosError<Response> {}

export const exportCustomer = async (variables?: Variables): Promise<Blob> => {
  const fileName = `${appDayJs().format(
    "YYMMDDHHmm"
  )}-DanhSachKhachHangDaiLy.xlsx`;
  const response = await consumerApi.get<Blob>(`/export/customer`, {
    params: variables,
    responseType: "blob",
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });

  downloadExcel(response, fileName);

  return response.data;
};

export const exportCustomerKey = exportCustomer.name;

export const useExportCustomerMutation = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: exportCustomer,
});
