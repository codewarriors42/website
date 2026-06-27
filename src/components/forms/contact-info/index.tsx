import type { ContactInfoTypeWithId } from '#/server/db/schemas/contact-info/contact-type'
import { AddContactInfoUI } from './add-contact-info'
import { EditContactInfoUI } from './edit-contact-info'

export function AddContactInfoForm() {
  return <AddContactInfoUI />
}

export function EditContactInfoForm({
  contactInfo,
}: {
  contactInfo: ContactInfoTypeWithId
}) {
  return <EditContactInfoUI contactInfo={contactInfo} />
}
