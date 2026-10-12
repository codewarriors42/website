import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { isValidObjectId } from "mongoose";
import z from "zod";

import { publicProcedure } from "../../integrations/trpc/init";
import { FaqModel } from "../db/schema/faq";
import { faqTypeSchema, faqTypeSchemaWithId } from "../db/schema/faq.db.type";

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

export const faqRouter = {
	getAll: publicProcedure.query(async () => {
		const faqs = await FaqModel.find().select("-__v").sort({ name: 1 }).lean();
		return faqs.map(serialize);
	}),

	getById: publicProcedure.input(idInput).query(async ({ input }) => {
		const faq = await FaqModel.findById(input.id).select("-__v").lean();
		if (!faq) throw notFound();
		return serialize(faq);
	}),

	create: publicProcedure.input(faqTypeSchema).mutation(async ({ input }) => {
		const faq = await FaqModel.create(input);
		return { id: faq.id as string };
	}),

	update: publicProcedure
		.input(faqTypeSchemaWithId)
		.mutation(async ({ input: { id, ...data } }) => {
			const updated = await FaqModel.findByIdAndUpdate(id, {
				$set: data,
			}).lean();
			if (!updated) throw notFound();
			return { id };
		}),

	delete: publicProcedure.input(idInput).mutation(async ({ input }) => {
		const { deletedCount } = await FaqModel.deleteOne({ _id: input.id });
		if (deletedCount === 0) throw notFound();
		return { id: input.id };
	}),
} satisfies TRPCRouterRecord;
