import { alumniRouter } from "#/server/routes/alumnis.ts";
import { archiveRouter } from "#/server/routes/archives.ts";
import { faqRouter } from "#/server/routes/faqs.ts";
import { memberRouter } from "#/server/routes/members.ts";
import { resourceRouter } from "#/server/routes/resources.ts";
import { createTRPCRouter } from "./init";

export const trpcRouter = createTRPCRouter({
	members: memberRouter,
	alumnis: alumniRouter,
	archives: archiveRouter,
	faqs: faqRouter,
	resources: resourceRouter,
});
export type TRPCRouter = typeof trpcRouter;
