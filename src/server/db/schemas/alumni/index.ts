import type { Model } from 'mongoose'
import mongoose, { Schema, model } from 'mongoose'
import type { Alumni } from './alumnis-type'

const AlumniSchema = new Schema<Alumni>(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    post: { type: [String], required: true },
    current: { type: String, required: false },
    socials: [
      {
        platform: { type: String, required: true },
        URL: { type: String, required: true },
      },
    ],
    image: { type: String, required: false, default: '/default-avatar.png' },
  },
  { timestamps: true },
)

export const AluminModel =
  typeof mongoose.models.Alumni !== 'undefined'
    ? (mongoose.models.Alumni as Model<Alumni>)
    : model<Alumni>('Alumni', AlumniSchema)
