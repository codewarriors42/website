import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { jwt_payload } from '#/types/jwt'

export type TRPCContext = {
  req: Request
  resHeaders: Headers
  session: jwt_payload | null
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Please log in to access this resource.',
    })
  }
  return next({ ctx })
})
