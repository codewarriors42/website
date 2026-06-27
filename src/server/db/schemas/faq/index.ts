import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'
import type { FaqType } from './faq-type'

const FaqSchema = new Schema<FaqType>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const FaqModel =
  typeof mongoose.models.Faq !== 'undefined'
    ? (mongoose.models.Faq as Model<FaqType>)
    : model<FaqType>('Faq', FaqSchema)
