"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { useState } from "react";
import { getQueryClient } from "./client";

export function ReactQueryProviders(props: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient || getQueryClient()}>
      <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
