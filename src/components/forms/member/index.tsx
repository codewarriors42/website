import type { MemberType } from '@/server/db/schemas/member/member-type'
import { AddMemberFormUI } from './add-member-form'
import { EditMemberFormUI } from './edit-member-form'
import { MemberFormProvider } from './hooks/ctx'

export function AddMemberForm() {
  return (
    <MemberFormProvider>
      <AddMemberFormUI />
    </MemberFormProvider>
  )
}

export function EditMemberForm({
  data,
}: {
  data: MemberType & { id: string }
}) {
  return (
    <MemberFormProvider initialData={data}>
      <EditMemberFormUI />
    </MemberFormProvider>
  )
}
