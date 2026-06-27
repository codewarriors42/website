import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'
import type { ArchiveType } from './archive-type'

const ArchiveSchema = new Schema<ArchiveType>(
  {
    title: { type: String, required: true },
    competition: { type: String, required: true },
    year: { type: Number, required: true },
    links: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    category: { type: String, required: true },
    event: { type: String, required: true },
    contributors: { type: [String], required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const ArchiveModel =
  typeof mongoose.models.Archive !== 'undefined'
    ? (mongoose.models.Archive as Model<ArchiveType>)
    : model<ArchiveType>('Archive', ArchiveSchema)
