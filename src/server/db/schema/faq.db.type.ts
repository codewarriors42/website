import z from "zod";

export const faqTypeSchema = z.object({
	question: z.string().min(1, { message: "Question is required" }),
	answer: z.string().min(1, { message: "Answer is required" }),
});

export const faqTypeSchemaWithId = faqTypeSchema.extend({
	id: z.string(),
});
export type FaqTypeWithId = z.infer<typeof faqTypeSchemaWithId>;
export type FaqType = z.infer<typeof faqTypeSchema>;
