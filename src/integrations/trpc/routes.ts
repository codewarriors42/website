import { createTRPCRouter } from './init'
import { authRouter } from '#/server/routes/auth'
import { membersRouter } from '#/server/routes/member'
import { AlumniRouter } from '#/server/routes/alumni'
import { contactRouter } from '#/server/routes/contact'
import { FAQRouter } from '#/server/routes/faq'
import { resourceRouter } from '#/server/routes/resource'
import { eventRouter } from '#/server/routes/event'
import { archiveRouter } from '#/server/routes/archive'

export const trpcRouter = createTRPCRouter({
  members: membersRouter,
  auth: authRouter,
  alumnis: AlumniRouter,
  contact: contactRouter,
  faqs: FAQRouter,
  resources: resourceRouter,
  event: eventRouter,
  archive: archiveRouter,
})
export type TRPCRouter = typeof trpcRouter
