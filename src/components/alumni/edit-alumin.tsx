import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { deleteMedia, uploadMedia } from '#/utils/media-handler'
import { ErrorToast, SuccessToast } from '../toast'
import { AlumniForm } from './alumin-form'
import type { Alumni } from '#/types/schemas/alumni.schema'

type UpdateMemberInput = Alumni & { id: string }

export function EditAlumni({ alumniData }: { alumniData?: UpdateMemberInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.alumnis.update.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: Alumni) => {
    if (!alumniData?.id) {
      ErrorToast('Missing alumni id')
      return
    }
    if (data.image === null || typeof data.image === 'string') {
      await mutateAsync({
        id: alumniData.id,
        ...data,
      })
      return 0
    }
    await deleteMedia(alumniData.image as string)
    const avatar_filename = await uploadMedia(data.image)
    await mutateAsync({
      id: alumniData.id,
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
            <h2 className="text-xl font-bold">Edit Alumni</h2>
            <p>Form to edit an existing alumni goes here.</p>
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
              initialData={alumniData}
              submitLabel="Save Changes"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
