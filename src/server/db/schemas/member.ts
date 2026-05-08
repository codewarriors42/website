import type { MemberType } from '#/types/member.types'
import type { Model } from 'mongoose'
import mongoose, { Schema, model } from 'mongoose'

const MemberSchema = new Schema<MemberType>(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    roles: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 0,
        'Must have at least one role',
      ],
    },
    socials: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    image: { type: String, required: false, default: '/default-avatar.png' },
  },
  { timestamps: true },
)

export const Member =
  typeof mongoose.models.Member !== 'undefined'
    ? (mongoose.models.Member as Model<MemberType>)
    : model<MemberType>('Member', MemberSchema)
