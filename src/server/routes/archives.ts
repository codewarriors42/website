import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { isValidObjectId } from "mongoose";
import z from "zod";

import { publicProcedure } from "../../integrations/trpc/init";
import { ArchiveModel } from "../db/schema/archive";
import {
	archiveSchema,
	archiveSchemaWithId,
} from "../db/schema/archive.db.type";

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

export const archiveRouter = {
	getAll: publicProcedure.query(async () => {
		const alumni = await ArchiveModel.find()
			.select("-__v")
			.sort({ name: 1 })
			.lean();
		return alumni.map(serialize);
	}),

	getById: publicProcedure.input(idInput).query(async ({ input }) => {
		const alumni = await ArchiveModel.findById(input.id).select("-__v").lean();
		if (!alumni) throw notFound();
		return serialize(alumni);
	}),

	create: publicProcedure.input(archiveSchema).mutation(async ({ input }) => {
		const alumni = await ArchiveModel.create(input);
		return { id: alumni.id as string };
	}),

	update: publicProcedure
		.input(archiveSchemaWithId)
		.mutation(async ({ input: { id, ...data } }) => {
			const updated = await ArchiveModel.findByIdAndUpdate(id, {
				$set: data,
			}).lean();
			if (!updated) throw notFound();
			return { id };
		}),

	delete: publicProcedure.input(idInput).mutation(async ({ input }) => {
		const { deletedCount } = await ArchiveModel.deleteOne({ _id: input.id });
		if (deletedCount === 0) throw notFound();
		return { id: input.id };
	}),
} satisfies TRPCRouterRecord;
