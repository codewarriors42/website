import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { MemberForm } from './member-form'
import type { MemberFormValues } from '#/types/schemas/member.schema'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { deleteMedia, uploadMedia } from '#/utils/media-handler'
import { ErrorToast, SuccessToast } from '../toast'

type UpdateMemberInput = MemberFormValues & { id: string }

export function EditMember({ memberData }: { memberData?: UpdateMemberInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.members.updateMember.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: MemberFormValues) => {
    if (!memberData?.id) {
      ErrorToast('Missing member id')
      return
    }
    await deleteMedia(memberData.image as string)
    const avatar_filename =
      data.image instanceof File
        ? await uploadMedia(data.image)
        : data.image && data.image.length > 0
          ? data.image
          : '/default-avatar.png'
    await mutateAsync({
      ...data,
      id: memberData.id,
      image: avatar_filename,
    })
  }
  return (
    <Sheet side="bottom">
      <Sheet.Trigger className="btn">
        <Button variant="outline">
          <PencilIcon className="mr-2 text-yellow-500" size={22} />
        </Button>
      </Sheet.Trigger>
      <Sheet.Container>
        <Sheet.Header className="flex items-center border-b">
          <div className="p-5 w-full">
            <h2 className="text-xl font-bold">Edit Member</h2>
            <p>Form to edit an existing member goes here.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center">
          <div className="max-w-2xl max-auto py-10 w-full">
            <MemberForm
              isPending={isPending}
              initialData={memberData}
              submitLabel="Save Changes"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
