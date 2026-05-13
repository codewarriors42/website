import type { Archive } from '#/types/schemas/archive.schema'
import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'

const ArchiveSchema = new Schema<Archive>(
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
    contributors: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const ArchiveModel =
  typeof mongoose.models.Archive !== 'undefined'
    ? (mongoose.models.Archive as Model<Archive>)
    : model<Archive>('Archive', ArchiveSchema)
