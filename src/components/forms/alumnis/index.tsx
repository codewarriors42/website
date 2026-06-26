import type { Alumni } from '#/server/db/schemas/alumnis/alumnis-type'
import { AddAlumniFormUI } from './add-alumni-form'
import { EditAlumniFormUI } from './edit-alumin'
import { AlumniFormProvider } from './hooks/ctx'

export function AddAlumniForm() {
  return (
    <AlumniFormProvider>
      <AddAlumniFormUI />
    </AlumniFormProvider>
  )
}

export function EditAlumniForm({
  initialData,
}: {
  initialData: Alumni & { id: string }
}) {
  return (
    <AlumniFormProvider initialData={initialData}>
      <EditAlumniFormUI />
    </AlumniFormProvider>
  )
}
