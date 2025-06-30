import { consumerApi } from "@/lib/api";
import { ApiResponse } from "@/lib/api/schema";
import { AxiosError } from "axios";
import { createQuery, createSuspenseQuery } from "react-query-kit";
import { User } from "../user/schema";
import { Role } from "./schema";

export interface Variables {
  size?: number;
  page?: number;
  search?: string;
}

export interface Response extends ApiResponse<Role[]> {}

export interface Error extends AxiosError<Response> {}

export const getRoles = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>("/roles", {
    params: {
      search: variables?.search || "",
    },
  });

  return response.data;
};

export const getRolesKey = getRoles.name;

export const useRoles = createQuery<Response, Variables, any>({
  queryKey: [getRolesKey],
  fetcher: getRoles,
});

export const useSuspenseRoles = createSuspenseQuery<Response, Variables, Error>(
  {
    queryKey: [getRolesKey],
    fetcher: getRoles,
  }
);
