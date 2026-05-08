import type { Types } from 'mongoose'

export type JwtPayload = {
  userId: Types.ObjectId
  username: string
  name: string
}
