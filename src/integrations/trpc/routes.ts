import { createTRPCRouter } from './init'
import { testRouter } from '../../server/routes/test'
import { authRouter } from '#/server/routes/auth'

export const trpcRouter = createTRPCRouter({
  test: testRouter,
  auth: authRouter,
})
export type TRPCRouter = typeof trpcRouter
