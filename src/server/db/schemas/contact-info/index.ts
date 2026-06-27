import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'
import type { ContactInfoSchemaType } from './contact-type'

const ContactDBSchema = new Schema<ContactInfoSchemaType>(
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
    ? (mongoose.models.Contact as Model<ContactInfoSchemaType>)
    : model<ContactInfoSchemaType>('Contact', ContactDBSchema)
