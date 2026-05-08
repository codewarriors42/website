import { createTRPCRouter } from './init'
import { authRouter } from '#/server/routes/auth'
import { membersRouter } from '#/server/routes/members'

export const trpcRouter = createTRPCRouter({
  members: membersRouter,
  auth: authRouter,
})
export type TRPCRouter = typeof trpcRouter
