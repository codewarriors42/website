import { alumniRouter } from "#/server/routes/alumnis.ts";
import { archiveRouter } from "#/server/routes/archives.ts";
import { contactRouter } from "#/server/routes/contacts.ts";
import { faqRouter } from "#/server/routes/faqs.ts";
import { memberRouter } from "#/server/routes/members.ts";
import { resourceRouter } from "#/server/routes/resources.ts";
import { userRouter } from "#/server/routes/users.ts";
import { createTRPCRouter } from "./init";

export const trpcRouter = createTRPCRouter({
	members: memberRouter,
	alumnis: alumniRouter,
	archives: archiveRouter,
	faqs: faqRouter,
	resources: resourceRouter,
	users: userRouter,
	contacts: contactRouter,
});
export type TRPCRouter = typeof trpcRouter;
