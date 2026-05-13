import type { Event } from '#/types/schemas/event.schema'
import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'

const EventSchema = new Schema<Event>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const EventModel =
  typeof mongoose.models.Event !== 'undefined'
    ? (mongoose.models.Event as Model<Event>)
    : model<Event>('Event', EventSchema)
