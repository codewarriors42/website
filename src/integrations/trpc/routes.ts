import { createTRPCRouter } from './init'
import { authRouter } from '@/server/routes/auth'
import { memberRouter } from '@/server/routes/member'

export const trpcRouter = createTRPCRouter({
  auth: authRouter,
  member: memberRouter,
})
export type TRPCRouter = typeof trpcRouter
