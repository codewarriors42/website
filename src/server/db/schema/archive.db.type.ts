import { ARCHIVE_EVENTS } from "#/constant/archive-events.ts";
import z from "zod";

export const ARCHIVE_PLATFORMS = [
	"github",
	"behance",
	"dribbble",
	"youtube",
	"google_drive",
	"figma",
] as const;

export const ARCHIVE_CATEGORIES = [
	"creative-work",
	"creative-prompt",
	"quizzes",
	"crossword",
] as const;

export type ArchiveCategory = (typeof ARCHIVE_CATEGORIES)[number];
export type ArchivePlatformType = (typeof ARCHIVE_PLATFORMS)[number];

export const archiveSocialPlatform = z.object({
	platform: z.enum(ARCHIVE_PLATFORMS),
	URL: z.string().url(),
});

export const archiveSchema = z.object({
	title: z.string().trim().min(1, "Enter a title"),
	competition: z.string().trim().min(1, "Enter a competition name"),
	links: z.array(archiveSocialPlatform, { error: "Add at least one link" }),
	category: z.enum(ARCHIVE_CATEGORIES, { error: "Select a category" }),
	event: z.enum(ARCHIVE_EVENTS, { error: "Select an event" }),
	contributors: z.union([z.string(), z.array(z.string())]).optional(),
	year: z
		.number()
		.int()
		.min(1900, "Year must be a valid year")
		.max(new Date().getFullYear(), "Year cannot be in the future"),
	image: z.union([z.file(), z.string()]).optional(),
});

export const archiveSchemaWithId = archiveSchema.extend({
	id: z.string(),
});

export type ArchiveType = z.infer<typeof archiveSchema>;
export type ArchiveTypeWithId = z.infer<typeof archiveSchemaWithId>;
export type ArchiveLink = z.infer<typeof archiveSocialPlatform>;
