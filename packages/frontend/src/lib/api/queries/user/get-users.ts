import { consumerApi } from "@/lib/api";
import { ApiResponse } from "@/lib/api/schema";
import { AxiosError } from "axios";
import { createQuery, createSuspenseQuery } from "react-query-kit";
import { User } from "../user/schema";
import { UserStatus } from "./constant";

export interface Variables {
  size?: number;
  page?: number;
  search?: string;
  status?: UserStatus[];
  roles?: string[];
}

export interface Response extends ApiResponse<User[]> {}

export interface Error extends AxiosError<Response> {}

export const getUsers = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>("/users", {
    params: {
      size: variables?.size || 25,
      page: variables?.page || 0,
      search: variables?.search || "",
      status: variables?.status?.join(",") || [],
      roles: variables?.roles?.join(",") || [],
    },
  });

  return response.data;
};

export const getUsersKey = getUsers.name;

export const useUsers = createQuery<Response, Variables, any>({
  queryKey: [getUsersKey],
  fetcher: getUsers,
});

export const useSuspenseUsers = createSuspenseQuery<Response, Variables, Error>(
  {
    queryKey: [getUsersKey],
    fetcher: getUsers,
  }
);
