import z from "zod";
import { ROLES } from "#/constant/roles.ts";

export const ALUMNI_SOCIAL_PLATFORMS = [
	"twitter",
	"linkedin",
	"github",
	"instagram",
	"discord",
	"envelope",
	"website",
	"youtube",
	"dribbble",
	"behance",
] as const;

export type AlumniSocialPlatform = (typeof ALUMNI_SOCIAL_PLATFORMS)[number];

export const alumniSocialSchema = z
	.object({
		platform: z.enum(ALUMNI_SOCIAL_PLATFORMS),
		URL: z.string().trim().min(1, "URL is required"),
	})
	.superRefine((value, ctx) => {
		const isEmail = value.platform === "envelope";

		const valid = isEmail
			? z.string().email().safeParse(value.URL).success
			: z.string().url().safeParse(value.URL).success;

		if (!valid) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: isEmail ? "Invalid email" : "Invalid URL",
				path: ["URL"],
			});
		}
	});

export type AlumniSocial = z.infer<typeof alumniSocialSchema>;

export const alumniSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),

	year: z
		.number()
		.int()
		.min(1900, "Year must be valid")
		.max(new Date().getFullYear(), "Year cannot be in the future"),

	post: z.string().trim().optional(),
	roles: z.array(z.enum(ROLES)).min(1, "Select at least one role"),

	current: z.string().trim().optional(),

	socials: z.array(alumniSocialSchema),

	image: z.union([z.file(), z.string()]).optional(),
});

export type Alumni = z.infer<typeof alumniSchema>;

export const alumniWithIdSchema = alumniSchema.extend({
	id: z.string(),
});
export type AlumniWithId = z.infer<typeof alumniWithIdSchema>;
