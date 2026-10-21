import { ROLES } from "#/constant/roles.ts";
import z from "zod";

export const GRADES = [6, 7, 8, 9, 10, 11, 12] as const;
export type Grade = (typeof GRADES)[number];
export const SOCIAL_PLATFORMS = [
	"twitter",
	"linkedin",
	"github",
	"instagram",
	"discord",
	"envelope",
] as const;

export type MemberSocials = (typeof SOCIAL_PLATFORMS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SocialSchema = z
	.object({
		platform: z.enum(SOCIAL_PLATFORMS),
		URL: z.string().trim().min(1, "Enter a link"),
	})
	.superRefine((s, ctx) => {
		if (!s.URL) return;
		// Email accepts "name@x.com" or "mailto:name@x.com"; everything else must be an http(s) URL.
		const ok =
			s.platform === "envelope"
				? EMAIL_RE.test(s.URL.replace(/^mailto:/i, ""))
				: /^https?:\/\/\S+$/i.test(s.URL) && z.url().safeParse(s.URL).success;
		if (!ok) {
			ctx.addIssue({
				code: "custom",
				path: ["URL"],
				message:
					s.platform === "envelope"
						? "Enter a valid email address"
						: "Enter a valid URL starting with https://",
			});
		}
	});

export const MemberSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Name is required")
		.max(80, "Name is too long"),
	grade: z.union(
		[
			z.literal(6),
			z.literal(7),
			z.literal(8),
			z.literal(9),
			z.literal(10),
			z.literal(11),
			z.literal(12),
		],
		{ error: "Select a grade" },
	),
	roles: z.array(z.enum(ROLES)).min(1, "Select at least one role"),
	socials: z
		.array(SocialSchema)
		.refine(
			(list) => new Set(list.map((s) => s.platform)).size === list.length,
			"Only one link per platform",
		),
	image: z.union([z.file(), z.string()]).optional(),
});

export type MemberType = z.infer<typeof MemberSchema>;

export type SocialPlatform = z.infer<typeof SocialSchema>;

export const MemberWithIdSchema = MemberSchema.extend({
	id: z.string(),
});

export type MemberWithId = z.infer<typeof MemberWithIdSchema>;
