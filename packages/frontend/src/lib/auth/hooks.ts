import { Auth } from 'aws-amplify';
import { createMutation, createQuery } from 'react-query-kit';
import { consumerApi } from '../api';
import { getAuthError } from './constant';
import { CognitoUser } from './types';

export type SignInParameters = {
  username: string;
  password: string;
};

export type ChangePasswordParameters = {
  oldPassword: string;
  newPassword: string;
};

export type AdminResetPasswordParameters = {
  userId: string;
  newPassword: string;
};

export type ForgotPasswordParameters = {
  phone: string;
  email: string;
};

export type ResetPasswordParameters = {
  token: string;
  password: string;
};

export type VerifyResetPasswordTokenParameters = {
  token: string;
};

export const signIn = async ({ username, password }: SignInParameters) => {
  try {
    return await Auth.signIn({
      username,
      password,
    });
  } catch (error) {
    throw new Error(getAuthError((error as any)?.message));
  }
};

export const useSignIn = createMutation<CognitoUser, SignInParameters>({
  mutationFn: signIn,
});

export const signOut = async (): Promise<void> => {
  return await Auth.signOut();
};

export const useSignOut = createMutation<void, void>({
  mutationFn: signOut,
});

export const fetchAuthenticatedUser = async (): Promise<CognitoUser> => {
  return Auth.currentAuthenticatedUser();
};

export const useFetchAuthenticatedUser = createQuery<CognitoUser>({
  queryKey: ['authenticated-user'],
  fetcher: fetchAuthenticatedUser,
});

export const changePassword = async ({
  oldPassword,
  newPassword,
}: ChangePasswordParameters) => {
  const response = await consumerApi.post<Response>(`/auth/change-password`, {
    oldPassword,
    newPassword,
  });
  return response.data;
};

export const useChangePassword = createMutation<any, ChangePasswordParameters>({
  mutationFn: changePassword,
});

export const forgotPassword = async ({
  phone,
  email,
}: ForgotPasswordParameters) => {
  const response = await consumerApi.post<Response>(
    `/auth/forgot-password`,
    {
      phone,
      email,
    },
    {
      noAuth: true,
    }
  );
  return response.data;
};

export const useForgotPassword = createMutation<
  Response,
  ForgotPasswordParameters
>({
  mutationFn: forgotPassword,
});

export const resetPassword = async ({
  token,
  password,
}: ResetPasswordParameters) => {
  const response = await consumerApi.post<Response>(
    `/auth/reset-password`,
    {
      token,
      password,
    },
    {
      noAuth: true,
    }
  );
  return response.data;
};

export const useResetPassword = createMutation<
  Response,
  ResetPasswordParameters
>({
  mutationFn: resetPassword,
});

export const verifyResetPasswordToken = async ({
  token,
}: VerifyResetPasswordTokenParameters) => {
  const response = await consumerApi.get<Response>(
    `/auth/reset-password/verify-token/${token}`,
    {
      noAuth: true,
    }
  );
  return response.data;
};

export const useVerifyResetPasswordToken = createMutation<
  Response,
  VerifyResetPasswordTokenParameters
>({
  mutationFn: verifyResetPasswordToken,
});

export const adminResetPassword = async ({
  userId,
  newPassword,
}: AdminResetPasswordParameters) => {
  const response = await consumerApi.post<Response>(
    `/auth/admin-reset-password`,
    {
      userId,
      newPassword,
    }
  );
  return response.data;
};

export const useAdminResetPassword = createMutation<
  any,
  AdminResetPasswordParameters
>({
  mutationFn: adminResetPassword,
});
