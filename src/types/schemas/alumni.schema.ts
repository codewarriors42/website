import z from 'zod'
import { memberRoleSchema } from './member.schema'

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

const alumniSocialSchema = z
  .object({
    platform: alumniSocialPlatforms,
    url: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (value.url.length === 0) return

    const isEmail = value.platform === 'email'
    const result = isEmail
      ? z.string().email('Invalid email').safeParse(value.url)
      : z.string().url('Invalid URL').safeParse(value.url)

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: isEmail ? 'Invalid email' : 'Invalid URL',
        path: ['url'],
      })
    }
  })

export const alumniSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  year: z
    .number()
    .int()
    .min(1900, 'Year must be a valid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  post: z.array(memberRoleSchema),
  current: z.string(),
  socials: z.array(alumniSocialSchema),
  image: z.union([z.instanceof(File), z.string()]).nullable(),
})

export type Alumni = z.infer<typeof alumniSchema>
export type AlumniSocial = z.infer<typeof alumniSocialSchema>
export type AlumniSocialPlatform = z.infer<typeof alumniSocialPlatforms>
