import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { isValidObjectId } from "mongoose";
import z from "zod";
import argon2 from "argon2";
import { publicProcedure } from "../../integrations/trpc/init";
import { UserModel } from "../db/schema/user";
import {
	adminUserSchema,
	adminUserSchemaWithId,
} from "../db/schema/user.db.type";

const objectId = z
	.string()
	.refine((v) => isValidObjectId(v), "Invalid member id");
const idInput = z.object({ id: objectId });

const notFound = () =>
	new TRPCError({ code: "NOT_FOUND", message: "Member not found" });

const serialize = <T extends { _id: { toString(): string } }>({
	_id,
	...rest
}: T) => ({
	...rest,
	id: _id.toString(),
});

export const userRouter = {
	getAll: publicProcedure.query(async () => {
		const users = await UserModel.find()
			.select("-__v")
			.sort({ name: 1 })
			.lean();
		return users.map(serialize);
	}),

	getById: publicProcedure.input(idInput).query(async ({ input }) => {
		const user = await UserModel.findById(input.id).select("-__v").lean();
		if (!user) throw notFound();
		return serialize(user);
	}),

	create: publicProcedure.input(adminUserSchema).mutation(async ({ input }) => {
		const hashedPassword = await argon2.hash(input.password);
		const user = await UserModel.create({ ...input, password: hashedPassword });
		return { id: user.id as string };
	}),

	login: publicProcedure.input(adminUserSchema).mutation(async ({ input }) => {
		const user = await UserModel.findOne({ username: input.username });
		if (!user)
			throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

		const isPasswordValid = await argon2.verify(user.password, input.password);
		if (!isPasswordValid)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Invalid password",
			});

		return { id: user.id as string };
	}),

	update: publicProcedure
		.input(adminUserSchemaWithId)
		.mutation(async ({ input: { id, ...data } }) => {
			const updated = await UserModel.findByIdAndUpdate(id, {
				$set: data,
			}).lean();
			if (!updated) throw notFound();
			return { id };
		}),

	delete: publicProcedure.input(idInput).mutation(async ({ input }) => {
		const { deletedCount } = await UserModel.deleteOne({ _id: input.id });
		if (deletedCount === 0) throw notFound();
		return { id: input.id };
	}),
} satisfies TRPCRouterRecord;
