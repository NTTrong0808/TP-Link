import { Auth } from "aws-amplify";
import axios from "axios";

const consumerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface RequestConfig {
  ssr?: boolean;
  noAuth?: boolean;
}

declare module "axios" {
  interface InternalAxiosRequestConfig extends RequestConfig {}
  interface AxiosRequestConfig extends RequestConfig {}
}

consumerApi.interceptors.request.use(async (config) => {
  if (!(config.ssr || config.noAuth)) {
    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

    const token =
      currentAuthenticatedUser.signInUserSession.accessToken.jwtToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

consumerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);
export { consumerApi };
