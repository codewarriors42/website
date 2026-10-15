import z from "zod";

export const resourceSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be at most 100 characters"),
	link: z.string().url(),
	dark: z.union([z.file(), z.string().min(1, "Dark image is required")]),
	light: z.union([z.file(), z.string().min(1, "Light image is required")]),
});

export type ResourceType = z.infer<typeof resourceSchema>;
export const resourceSchemaWithId = resourceSchema.extend({
	id: z.string(),
});
export type ResourceTypeWithId = z.infer<typeof resourceSchemaWithId>;
