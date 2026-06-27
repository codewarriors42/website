import { alumniRouter } from '#/server/routes/alumni'
import { contactRouter } from '#/server/routes/contact-info'
import { FAQRouter } from '#/server/routes/faq'
import { resourceRouter } from '#/server/routes/resource'
import { createTRPCRouter } from './init'
import { authRouter } from '@/server/routes/auth'
import { memberRouter } from '@/server/routes/member'

export const trpcRouter = createTRPCRouter({
  auth: authRouter,
  member: memberRouter,
  alumni: alumniRouter,
  faq: FAQRouter,
  contact: contactRouter,
  resource: resourceRouter,
})
export type TRPCRouter = typeof trpcRouter
