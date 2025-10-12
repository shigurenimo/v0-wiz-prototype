"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"
import { WizMainView } from "@/components/wiz-main-view"
import { useClientLoading } from "@/hooks/use-client-loading"

const queryClient = new QueryClient()

export default function Home() {
  const isLoading = useClientLoading()

  if (isLoading) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <WizMainView />
      </Suspense>
    </QueryClientProvider>
  )
}
