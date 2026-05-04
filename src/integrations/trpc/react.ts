import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { TRPCRouter } from '#/integrations/trpc/routes'

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>()
