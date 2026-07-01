export const ARCHIVE_EVENTS = [
  '3D Modeling',
  'Quiz',
  'Motion Design',
  'Senior Quiz',
  'Designathon',
  'Hardware',
  'Graphic Design',
  'Hackathon',
  'Junior Quiz',
  'Surprise',
  'Crossword',
  'Filmmaking',
  'Photography',
  'Audio Editing',
  'Idea Pitching',
  'Compiled',
] as const

export type ArchiveEventType = (typeof ARCHIVE_EVENTS)[number]
