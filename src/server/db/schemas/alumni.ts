import type { Alumni } from '#/types/schemas/alumni.schema'
import type { Model } from 'mongoose'
import mongoose, { Schema, model } from 'mongoose'

const AlumniSchema = new Schema<Alumni>(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    post: { type: [String], required: true },
    current: { type: String, required: false },
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

export const Alumin =
  typeof mongoose.models.Alumni !== 'undefined'
    ? (mongoose.models.Alumni as Model<Alumni>)
    : model<Alumni>('Alumni', AlumniSchema)
