const events = [
  'web_development',
  'mobile_development',
  'design',
  'motion_design',
  'graphic_design',
  'competitive_programming',
  '3d_modeling',
] as const

export type EventType = (typeof events)[number]
