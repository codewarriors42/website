import { UserPlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { MemberForm } from './member-form'
import type { MemberFormValues } from '#/types/schemas/member.schema'
import { uploadMedia } from '#/utils/media-handler'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'

export function AddMember() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.members.addMember.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )
  const handleSubmit = async (data: MemberFormValues) => {
    const avatar_filename =
      data.image instanceof File
        ? await uploadMedia(data.image)
        : data.image && data.image.length > 0
          ? data.image
          : '/default-avatar.png'
    await mutateAsync({
      ...data,
      image: avatar_filename,
    })
  }
  return (
    <Sheet side="bottom">
      <Sheet.Trigger className="btn">
        <Button variant="outline" className="w-full h-full px-7 py-3" asChild>
          <UserPlusIcon size={20} />
        </Button>
      </Sheet.Trigger>
      <Sheet.Container className="grid">
        <Sheet.Header className="flex items-center border-b">
          <div className="p-5 w-full">
            <h2 className="text-xl font-bold">Add Member</h2>
            <p>Form to add a new member goes here.</p>
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
              submitLabel="Add Member"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
