import z from 'zod'

const ARCHIVE_PLATFORMS = [
  'github',
  'youtube',
  'behance',
  'dribbble',
  'youtube',
  'google_drive',
  'figma',
] as const

const ARCHIVE_CATEGORIES = [
  'creative_work',
  'creative_prompt',
  'quizzes',
  'crossword',
] as const

export type ArchiveCategory = (typeof ARCHIVE_CATEGORIES)[number]
export type ArchivePlatformType = (typeof ARCHIVE_PLATFORMS)[number]

const socialLinks = z.object({
  platform: z.enum(ARCHIVE_PLATFORMS),
  url: z.string().url(),
})

export const archiveSchema = z.object({
  title: z.string(),
  competition: z.string(),
  links: z.array(socialLinks),
  category: z.enum(ARCHIVE_CATEGORIES),
  event: z.string(),
  contributors: z.string().array(),
  year: z
    .number()
    .int()
    .min(1900, 'Year must be a valid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  image: z.string(),
})

export type ArchiveType = z.infer<typeof archiveSchema>
export type ArchiveTypeWithId = ArchiveType & { id: string }
export type ArchiveLink = z.infer<typeof socialLinks>
