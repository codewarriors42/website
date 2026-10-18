import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { isValidObjectId } from "mongoose";
import z from "zod";

import { publicProcedure } from "../../integrations/trpc/init";
import { ContactModel } from "../db/schema/contact";
import {
	contactSchema,
	contactSchemaWithId,
} from "../db/schema/contact.db.type";

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

export const contactRouter = {
	getAll: publicProcedure.query(async () => {
		const contacts = await ContactModel.find()
			.select("-__v")
			.sort({ name: 1 })
			.lean();
		return contacts.map(serialize);
	}),

	getById: publicProcedure.input(idInput).query(async ({ input }) => {
		const contact = await ContactModel.findById(input.id).select("-__v").lean();
		if (!contact) throw notFound();
		return serialize(contact);
	}),

	create: publicProcedure.input(contactSchema).mutation(async ({ input }) => {
		const contact = await ContactModel.create(input);
		return { id: contact.id as string };
	}),

	update: publicProcedure
		.input(contactSchemaWithId)
		.mutation(async ({ input: { id, ...data } }) => {
			const updated = await ContactModel.findByIdAndUpdate(id, {
				$set: data,
			}).lean();
			if (!updated) throw notFound();
			return { id };
		}),

	delete: publicProcedure.input(idInput).mutation(async ({ input }) => {
		const { deletedCount } = await ContactModel.deleteOne({ _id: input.id });
		if (deletedCount === 0) throw notFound();
		return { id: input.id };
	}),
} satisfies TRPCRouterRecord;
