import type { ArchiveTypeWithId } from '#/server/db/schemas/archive/archive-type'
import { AddArchiveFormUI } from './add-archive-form'
import { EditArchiveFormUI } from './edit-archive'
import { ArchiveFormProvider } from './hooks/ctx'

export function AddArchiveForm() {
  return (
    <ArchiveFormProvider>
      <AddArchiveFormUI />
    </ArchiveFormProvider>
  )
}

export function EditArchiveForm({
  initialData,
}: {
  initialData: ArchiveTypeWithId
}) {
  return (
    <ArchiveFormProvider initialData={initialData}>
      <EditArchiveFormUI />
    </ArchiveFormProvider>
  )
}
