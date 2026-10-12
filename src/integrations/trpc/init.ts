import { connectDB } from "#/server/db/index.ts";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";

export type TRPCContext = {
	req: Request;
	resHeaders: Headers;
	session: null;
	db: null;
};

const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
	// Send validation errors to the client in a form-friendly shape:
	// error.data.zodError.fieldErrors.name -> ["Name is required"]
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? z.flattenError(error.cause) : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory; // server-side calls + tests
export const middleware = t.middleware;

/** Logs how long each procedure takes (dev only). */
const timing = t.middleware(async ({ path, type, next }) => {
	const start = performance.now();
	const result = await next();
	if (process.env.NODE_ENV !== "production") {
		console.log(
			`[trpc] ${type} ${path} ${Math.round(performance.now() - start)}ms`,
		);
	}
	return result;
});

const withDb = t.middleware(async ({ next }) => {
	await connectDB(); // returns the cached connection after the first call
	return next();
});

export const publicProcedure = t.procedure.use(timing).use(withDb);

/** Requires a logged-in user. `ctx.session` is guaranteed non-null afterwards. */
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Please log in to access this resource.",
		});
	}
	// Passing session explicitly narrows its type for everything downstream.
	return next({ ctx: { session: ctx.session } });
});

/** Requires an admin. Use this for member create/update/delete. */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
	// Adjust to your jwt_payload shape (e.g. `role`, `isAdmin`, `roles.includes(...)`).
	if (ctx.session !== "admin") {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You don't have permission to do this.",
		});
	}
	return next();
});
