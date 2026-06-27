import type { FaqType } from '#/server/db/schemas/faq/faq-type'
import { AddFaqUI } from './add-faq'
import { EditFaqUI } from './edit-faq'

export function AddFaqForm() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AddFaqUI />
    </div>
  )
}

export function EditFaqForm({ faq, id }: { faq: FaqType; id: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <EditFaqUI faq={faq} id={id} />
    </div>
  )
}
