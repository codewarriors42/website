import type { Types } from 'mongoose'

export type jwt_payload = {
  userId: Types.ObjectId
  username: string
  name: string
}
