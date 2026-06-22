import type { TRPCRouterRecord } from '@trpc/server'

import { publicProcedure } from '../../integrations/trpc/init'

export const testRouter = {
  test: publicProcedure.query(() => 'Hello, world!'),
} satisfies TRPCRouterRecord
