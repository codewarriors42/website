import type { FAQSchema } from '#/types/schemas/faq.schema'
import type { Model } from 'mongoose'
import mongoose, { model, Schema } from 'mongoose'

const FAQSchema = new Schema<FAQSchema>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const FAQModel =
  typeof mongoose.models.FAQ !== 'undefined'
    ? (mongoose.models.FAQ as Model<FAQSchema>)
    : model<FAQSchema>('FAQ', FAQSchema)
