import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'
import type { ResourceType } from './resource-type'

const ResourceSchema = new Schema<ResourceType>(
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
    ? (mongoose.models.Resource as Model<ResourceType>)
    : model<ResourceType>('Resource', ResourceSchema)
