import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({
  Component,
  pageProps,
}: AppProps<{ dehydrateState: DehydratedState }>) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydrateState}>
          <Component {...pageProps} />
          <ToastContainer />
        </Hydrate>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
