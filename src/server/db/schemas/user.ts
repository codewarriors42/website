import type { Model } from 'mongoose'
import mongoose, { Schema, model } from 'mongoose'

type UserType = {
  username: string
  password: string
  name: string
  isSupreme: boolean
}
const UserSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isSupreme: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
)

export const User =
  typeof mongoose.models.User !== 'undefined'
    ? (mongoose.models.User as Model<UserType>)
    : model<UserType>('User', UserSchema)
