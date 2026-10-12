import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { isValidObjectId } from "mongoose";
import z from "zod";

import { publicProcedure } from "../../integrations/trpc/init";
import { MemberSchema } from "../db/schema/member.db.type";
import { MemberModel } from "../db/schema/member";

const objectId = z
	.string()
	.refine((v) => isValidObjectId(v), "Invalid member id");
const idInput = z.object({ id: objectId });
const updateInput = MemberSchema.extend({ id: objectId });

const notFound = () =>
	new TRPCError({ code: "NOT_FOUND", message: "Member not found" });

const serialize = <T extends { _id: { toString(): string } }>({
	_id,
	...rest
}: T) => ({
	...rest,
	id: _id.toString(),
});

export const memberRouter = {
	getAll: publicProcedure.query(async () => {
		const members = await MemberModel.find()
			.select("-__v")
			.sort({ name: 1 })
			.lean();
		return members.map(serialize);
	}),

	getById: publicProcedure.input(idInput).query(async ({ input }) => {
		const member = await MemberModel.findById(input.id).select("-__v").lean();
		if (!member) throw notFound();
		return serialize(member);
	}),

	create: publicProcedure.input(MemberSchema).mutation(async ({ input }) => {
		const member = await MemberModel.create(input);
		return { id: member.id as string };
	}),

	update: publicProcedure
		.input(updateInput)
		.mutation(async ({ input: { id, ...data } }) => {
			const updated = await MemberModel.findByIdAndUpdate(id, {
				$set: data,
			}).lean();
			if (!updated) throw notFound();
			return { id };
		}),

	delete: publicProcedure.input(idInput).mutation(async ({ input }) => {
		const { deletedCount } = await MemberModel.deleteOne({ _id: input.id });
		if (deletedCount === 0) throw notFound();
		return { id: input.id };
	}),
} satisfies TRPCRouterRecord;
