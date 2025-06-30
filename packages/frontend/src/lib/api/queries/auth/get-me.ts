import { consumerApi } from "@/lib/api";
import { ApiResponse } from "@/lib/api/schema";
import { AxiosError } from "axios";
import { createQuery, createSuspenseQuery } from "react-query-kit";
import { User } from "../user/schema";

export interface Variables {}

export interface Response extends ApiResponse<User> {}

export interface Error extends AxiosError<Response> {}

export const getMe = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>("/auth/me", {
    params: variables,
  });

  return response.data;
};

export const getMeKey = getMe.name;

export const useMe = createQuery<Response, Variables, any>({
  queryKey: [getMeKey],
  fetcher: getMe,
});

export const useSuspenseMe = createSuspenseQuery<Response, Variables, Error>({
  queryKey: [getMeKey],
  fetcher: getMe,
});
