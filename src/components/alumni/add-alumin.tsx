import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { uploadMedia } from '#/utils/media-handler'
import { ErrorToast, SuccessToast } from '../toast'
import { AlumniForm } from './alumin-form'
import type { Alumni } from '#/types/schemas/alumni.schema'

type UpdateMemberInput = Alumni & { id: string }

export function AddAlumni({ memberData }: { memberData?: UpdateMemberInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.alumnis.create.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        console.error(err)
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: Alumni) => {
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
      <Sheet.Trigger className="btn" asChild>
        <Button variant="outline">
          <PencilIcon className="mr-2 text-yellow-500" size={22} />
        </Button>
      </Sheet.Trigger>
      <Sheet.Container>
        <Sheet.Header className="flex items-center border-b">
          <div className="p-5 w-full">
            <h2 className="text-xl font-bold">Add Alumni</h2>
            <p>Form to add a new alumni goes here.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center">
          <div className="max-w-2xl max-auto py-10 w-full">
            <AlumniForm
              isPending={isPending}
              initialData={memberData}
              submitLabel="Add Alumni"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
