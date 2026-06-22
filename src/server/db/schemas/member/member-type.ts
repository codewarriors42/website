import z from "zod";

export const ROLES = [
  "gaming",
  "competitive_programming",
  "app_development",
  "web_development",
  "game_development",
  "film_making",
  "audio_editing",
  "designing",
  "3d_modeling",
  "photography",
  "quiz",
  "crossword",
  "techathlon",
  "group_discussion",
  "motion_design",
  "vice_president",
  "president",
  "creative_head",
  "quiz_corss_head",
  "programming_head",
  "group_discussion_head",
  "head_developer",
] as const;

export const GRADES = [6, 7, 8, 9, 10, 11, 12] as const;

export const SOCIAL_PLATFORMS = [
  "github",
  "insta",
] as const;

export const MemberSchema = z.object({
  name: z.string(),
  grade: z.union([
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
    z.literal(11),
    z.literal(12),
  ]),
  roles: z.array(z.enum(ROLES)),
  socials: z.array(
    z.object({
      platform: z.enum(SOCIAL_PLATFORMS),
      url: z.url(),
    })
  ),
  image: z.url(),
});

export type MemberType = z.infer<typeof MemberSchema>;

export const MemberWithIdSchema = MemberSchema.extend({
  id: z.string(),
});

export type MemberWithId = z.infer<typeof MemberWithIdSchema>;
