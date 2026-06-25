import z from 'zod'
import { ROLES } from '../member/member-type'

export const alumniSocialPlatforms = z.enum([
  'twitter',
  'linkedin',
  'github',
  'instagram',
  'discord',
  'email',
  'website',
  'youtube',
  'dribbble',
  'behance',
])

export type AlumniSocialPlatform = z.infer<typeof alumniSocialPlatforms>

export const alumniSocialSchema = z
  .object({
    platform: alumniSocialPlatforms,
    url: z.string().trim().min(1, 'URL is required'),
  })
  .superRefine((value, ctx) => {
    const isEmail = value.platform === 'email'

    const valid = isEmail
      ? z.string().email().safeParse(value.url).success
      : z.string().url().safeParse(value.url).success

    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: isEmail ? 'Invalid email' : 'Invalid URL',
        path: ['url'],
      })
    }
  })

export type AlumniSocial = z.infer<typeof alumniSocialSchema>

export const alumniSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  year: z
    .number()
    .int()
    .min(1900, 'Year must be valid')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),

  post: z.array(z.enum(ROLES)),

  current: z.string().min(1, 'Current position is required'),

  socials: z.array(alumniSocialSchema),

  image: z.union([z.instanceof(File), z.string()]).nullable(),
})

export type Alumni = z.infer<typeof alumniSchema>
