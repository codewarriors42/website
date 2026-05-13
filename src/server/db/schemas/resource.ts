import type { Resource } from '#/types/schemas/resource.schema'
import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'

const ResourceSchema = new Schema<Resource>(
  {
    event: { type: String, required: true },
    link: { type: String, required: true },
    dark: { type: String, required: true },
    light: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const ResourceModel =
  typeof mongoose.models.Resource !== 'undefined'
    ? (mongoose.models.Resource as Model<Resource>)
    : model<Resource>('Resource', ResourceSchema)
