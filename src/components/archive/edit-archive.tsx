import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { ArchiveForm } from './archive-from'
import type { Archive } from '#/types/schemas/archive.schema'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { deleteMedia, uploadMedia } from '#/utils/media-handler'
import { ErrorToast, SuccessToast } from '../toast'

type UpdateArchiveInput = Archive & { id: string }

export function EditArchive({
  archiveData,
}: {
  archiveData?: UpdateArchiveInput
}) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.archive.update.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: Archive) => {
    if (!archiveData?.id) {
      ErrorToast('Missing archive id')
      return
    }

    if (data.image == null || typeof data.image === 'string') {
      await mutateAsync({
        id: archiveData.id,
        ...data,
        image: data.image ?? archiveData.image,
      })
      return
    }

    // data.image is a File
    if (typeof archiveData.image === 'string' && archiveData.image.length > 0) {
      await deleteMedia(archiveData.image)
    }
    const image_filename = await uploadMedia(data.image)
    await mutateAsync({
      id: archiveData.id,
      ...data,
      image: image_filename,
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
        <Sheet.Header className="flex items-center justify-between border-b">
          <div className="p-5 flex-1">
            <h2 className="text-xl font-bold text-left">Edit Archive</h2>
            <p>Form to edit an existing archive entry goes here.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center px-4 sm:px-0 py-6">
          <div className="max-w-2xl mx-auto py-10 w-full px-4 sm:px-0 my-auto">
            <ArchiveForm
              isPending={isPending}
              initialData={archiveData}
              submitLabel="Save Changes"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
