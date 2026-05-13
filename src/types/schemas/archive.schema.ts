import z from 'zod'

const platformLinks = z.enum([
  'github',
  'youtube',
  'behance',
  'dribbble',
  'youtube',
  'goole_drive',
  'figma',
])

const socialLinks = z.object({
  platform: platformLinks,
  url: z.string().url(),
})

export const archiveSchema = z.object({
  title: z.string(),
  competition: z.string(),
  links: z.array(socialLinks),
  category: z.string(),
  event: z.string(),
  contributors: z.string(),
  year: z
    .number()
    .int()
    .min(1900, 'Year must be a valid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  image: z.union([z.instanceof(File), z.string()]).nullable(),
})

export type Archive = z.infer<typeof archiveSchema>
export type ArchiveLink = z.infer<typeof socialLinks>
export type ArchivePlatform = z.infer<typeof platformLinks>
