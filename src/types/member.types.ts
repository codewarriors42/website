import type { MemberRole, Social } from '#/types/schemas/member.schema'

export type Member = {
  name: string
  grade: string
  roles: MemberRole[]
  socials: Social[]
  image?: string
}

export type MemberType = Member
