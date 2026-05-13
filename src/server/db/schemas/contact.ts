import type { ContactSchema } from '#/types/schemas/contact.schema'
import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'

const ContactDBSchema = new Schema<ContactSchema>(
  {
    post: { type: String, required: true },
    mail: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const ContactModel =
  typeof mongoose.models.Contact !== 'undefined'
    ? (mongoose.models.Contact as Model<ContactSchema>)
    : model<ContactSchema>('Contact', ContactDBSchema)
