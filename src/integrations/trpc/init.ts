import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { JwtPayload } from '#/types/auth/jwt'
import type mongoose from 'mongoose'

export type TRPCContext = {
  req: Request
  resHeaders: Headers
  session: JwtPayload | null
  db: mongoose.Connection
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
