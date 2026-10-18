import z from "zod";

export const contactSchema = z.object({
	post: z.string().min(1, "Post is required"),
	mail: z.string().email("Invalid email address").min(1, "Email is required"),
});

export const contactSchemaWithId = contactSchema.extend({
	id: z.string().min(1, "ID is required"),
});

export type ContactInfoSchemaType = z.infer<typeof contactSchema>;
export type ContactInfoTypeWithId = z.infer<typeof contactSchemaWithId>;
