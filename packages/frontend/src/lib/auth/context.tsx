"use client";

import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useMe } from "../api/queries/auth/get-me";
import { User } from "../api/queries/user/schema";
import { AbilityContext, updateAbility } from "./casl";
import { AuthGuard, AuthLoading } from "./components";
import { AmplifyProvider } from "./config";
import {
  ChangePasswordParameters,
  ForgotPasswordParameters,
  ResetPasswordParameters,
  SignInParameters,
  useChangePassword,
  useFetchAuthenticatedUser,
  useForgotPassword,
  useResetPassword,
  useSignIn,
  useSignOut,
  VerifyResetPasswordTokenParameters,
} from "./hooks";
import { CognitoUser } from "./types";

export const AUTH_ROLES = {
  GUEST: "guest",
} as const;

export type AuthRole = string;

export interface AuthContextType {
  cognitoUser: CognitoUser | null;
  currentUser: User | null;
  role: AuthRole | null;
  state: "idle" | "loading" | "done" | "signingOut";
  signOut: () => Promise<void>;
  signIn: UseMutateAsyncFunction<CognitoUser, Error, SignInParameters, unknown>;
  changePassword: UseMutateAsyncFunction<
    string,
    Error,
    ChangePasswordParameters,
    unknown
  >;
  forgotPassword: UseMutateAsyncFunction<
    Response,
    Error,
    ForgotPasswordParameters,
    unknown
  >;
  resetPassword: UseMutateAsyncFunction<
    Response,
    Error,
    ResetPasswordParameters,
    unknown
  >;
  verifyResetPasswordToken?: UseMutateAsyncFunction<
    Response,
    Error,
    VerifyResetPasswordTokenParameters,
    unknown
  >;
}

export const AuthContext = createContext<AuthContextType>({
  state: "idle",
} as AuthContextType);

export interface AuthProviderProps extends PropsWithChildren {}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const ql = useQueryClient();
  const {
    data: authenticatedUser,
    isLoading: isLoadingAuthenticatedUser,
    isFetching: isFetchingAuthenticatedUser,
  } = useFetchAuthenticatedUser({
    retry: 0,
  });

  const {
    data: me,
    isLoading: isLoadingMe,
    isFetching: isFetchingMe,
  } = useMe({
    enabled: !!authenticatedUser,
    select: (data) => {
      if (
        authenticatedUser &&
        data.data?.role?.permissionKeys &&
        data.data?.role?.permissionKeys.length &&
        abilityInstance
      ) {
        updateAbility(abilityInstance, data.data.role.permissionKeys);
      }
      return data;
    },
  });

  const abilityInstance = useContext(AbilityContext);

  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOut({
    onSuccess() {
      ql.invalidateQueries({ queryKey: useFetchAuthenticatedUser.getKey() });

      ql.setQueryData(useFetchAuthenticatedUser.getKey(), null!);
    },
  });

  const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn({
    onSuccess: async () => {
      await Promise.all([
        ql.invalidateQueries({
          queryKey: useFetchAuthenticatedUser.getKey(),
        }),
        ql.invalidateQueries({
          queryKey: useMe.getKey(),
        }),
      ]);
    },
  });

  const { mutateAsync: forgotPassword, isPending: isForgotPassword } =
    useForgotPassword({
      onSuccess() {
        ql.invalidateQueries({ queryKey: useFetchAuthenticatedUser.getKey() });

        ql.setQueryData(useFetchAuthenticatedUser.getKey(), null!);
      },
    });

  const { mutateAsync: resetPassword, isPending: isResetPassword } =
    useResetPassword({
      onSuccess() {
        ql.invalidateQueries({ queryKey: useFetchAuthenticatedUser.getKey() });
        ql.setQueryData(useFetchAuthenticatedUser.getKey(), null!);
      },
    });

  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword({
      onSuccess() {
        ql.invalidateQueries({ queryKey: useFetchAuthenticatedUser.getKey() });

        ql.setQueryData(useFetchAuthenticatedUser.getKey(), null!);
      },
    });

  const state = useMemo(
    () =>
      isSigningOut
        ? "signingOut"
        : isLoadingAuthenticatedUser || isLoadingMe || isSigningIn
        ? "loading"
        : "done",
    [isLoadingAuthenticatedUser, isLoadingMe, isSigningIn, isSigningOut]
  );

  const values = useMemo<AuthContextType>(() => {
    return {
      cognitoUser: authenticatedUser || null,
      currentUser: me?.data || null,
      role: authenticatedUser
        ? (authenticatedUser?.attributes?.["custom:role"] as string) ||
          AUTH_ROLES.GUEST
        : AUTH_ROLES.GUEST,
      state: state,
      signOut,
      signIn,
      changePassword,
      forgotPassword,
      resetPassword,
    };
  }, [authenticatedUser, me?.data, isLoadingAuthenticatedUser, state]);

  return (
    <AuthContext.Provider value={values}>
      <AbilityContext.Provider value={abilityInstance}>
        <AuthLoading loading={isLoadingAuthenticatedUser}>
          <AuthGuard type="authorize" loading={isLoadingMe}>
            {children}
          </AuthGuard>
        </AuthLoading>
      </AbilityContext.Provider>

      <AmplifyProvider />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  return ctx;
};

export default AuthProvider;
