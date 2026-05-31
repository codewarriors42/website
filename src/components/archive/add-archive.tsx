import { UserPlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import type { Archive } from '#/types/schemas/archive.schema'
import { uploadMedia } from '#/utils/media-handler'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { ArchiveForm } from './archive-from'

export function AddArchive() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.archive.create.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )
  const handleSubmit = async (data: Archive) => {
    const image_filename =
      data.image instanceof File
        ? await uploadMedia(data.image)
        : typeof data.image === 'string' && data.image.length > 0
          ? data.image
          : null
    await mutateAsync({
      ...data,
      image: image_filename,
    })
  }
  return (
    <Sheet side="bottom">
      <Sheet.Trigger className="btn" asChild>
        <Button variant="outline" className="w-full h-full px-7 py-3">
          <UserPlusIcon size={20} />
        </Button>
      </Sheet.Trigger>
      <Sheet.Container>
        <Sheet.Header className="flex items-center justify-between border-b">
          <div className="p-5 flex-1">
            <h2 className="text-xl font-bold text-left">Add Archive</h2>
            <p>Form to add a new archive entry goes here.</p>
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
              submitLabel="Add Archive"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
