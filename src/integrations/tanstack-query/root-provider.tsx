import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import superjson from 'superjson'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createIsomorphicFn } from '@tanstack/react-start'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import type { TRPCRouter } from '#/integrations/trpc/routes'
import { TRPCProvider } from '#/integrations/trpc/react'

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return ''
    return `http://localhost:${process.env.PORT ?? 3000}`
  })()
  return `${base}/api/trpc`
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: getUrl(),
      async headers() {
        return getTrpcHeaders()
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})

const getTrpcHeaders = createIsomorphicFn()
  .client(() => ({}))
  .server(async () => {
    try {
      const mod = await import('@tanstack/react-start/server')
      const request = mod.getRequest()
      const cookie = request.headers.get('cookie')
      return cookie ? { cookie } : {}
    } catch {
      return {}
    }
  })
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  const context = {
    queryClient,
    trpc: serverHelpers,
  }

  return context
}

export default function TanstackQueryProvider({
  children,
  context,
}: {
  children: ReactNode
  context: ReturnType<typeof getContext>
}) {
  const { queryClient } = context

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
