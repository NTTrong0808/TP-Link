"use client";

import { Amplify } from "aws-amplify";
import { PropsWithChildren } from "react";

Amplify.configure({
  region: process.env.NEXT_PUBLIC_REGION!,
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
  userPoolWebClientId: process.env.NEXT_PUBLIC_USER_CLIENT_ID!,
});

export function AmplifyProvider({ children }: PropsWithChildren) {
  return children;
}
