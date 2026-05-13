import { z } from 'zod'

export const socialPlatformSchema = z.enum([
  'twitter',
  'linkedin',
  'github',
  'instagram',
  'discord',
  'email',
])

export type SocialPlatform = z.infer<typeof socialPlatformSchema>

const socialUrlSchema = z.string().url('Invalid URL')
const socialEmailSchema = z.string().email('Invalid email')

export const socialSchema = z
  .object({
    platform: socialPlatformSchema,

    url: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (value.url.length === 0) return

    const isEmail = value.platform === 'email'
    const result = isEmail
      ? socialEmailSchema.safeParse(value.url)
      : socialUrlSchema.safeParse(value.url)

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: isEmail ? 'Invalid email' : 'Invalid URL',
        path: ['url'],
      })
    }
  })

export type Social = z.infer<typeof socialSchema>

export const memberRoles = [
  'gaming',
  'competitive_programming',
  'app_development',
  'web_development',
  'game_development',
  'film_making',
  'audio_editing',
  'designing',
  '3d_modeling',
  'photography',
  'quiz',
  'crossword',
  'techathlon',
  'group_discussion',
  'motion_design',
  'vice_president',
  'president',
  'creative_head',
  'quiz_corss_head',
  'programming_head',
  'group_discussion_head',
  'head_developer',
  'undefined',
] as const

export const memberRoleSchema = z.enum(memberRoles)

export type MemberRole = z.infer<typeof memberRoleSchema>

export const DEFAULT_MEMBER_ROLE: MemberRole = 'undefined'

export const MemberGrade = [6, 7, 8, 9, 10, 11, 12] as const

export const memberSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  grade: z.string(),
  roles: z.array(memberRoleSchema),

  socials: z.array(socialSchema),

  image: z.union([z.instanceof(File), z.string()]).nullable(),
})

export const memberDBSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  grade: z.string(),
  roles: z.array(memberRoleSchema),

  socials: z.array(socialSchema),
  image: z.string().optional().default('/default-avatar.png'),
})

export type MemberFormValues = z.infer<typeof memberSchema>
export type MemberDBValues = z.infer<typeof memberDBSchema>
