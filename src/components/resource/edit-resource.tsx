import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { ResourceForm } from './resource-form'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { deleteMedia, uploadMedia } from '#/utils/media-handler'
import { ErrorToast, SuccessToast } from '../toast'
import type { Resource } from '#/types/schemas/resource.schema'

type UpdateResourceInput = Resource & { id: string }

export function EditResource({
  resourceData,
}: {
  resourceData?: UpdateResourceInput
}) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.resources.update.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: Resource) => {
    if (!resourceData?.id) {
      ErrorToast('Missing resource id')
      return
    }

    let darkUrl = data.dark
    let lightUrl = data.light

    // Handle dark image upload/deletion
    if (data.dark instanceof File) {
      if (resourceData.dark && typeof resourceData.dark === 'string') {
        await deleteMedia(resourceData.dark)
      }
      darkUrl = await uploadMedia(data.dark)
    }

    // Handle light image upload/deletion
    if (data.light instanceof File) {
      if (resourceData.light && typeof resourceData.light === 'string') {
        await deleteMedia(resourceData.light)
      }
      lightUrl = await uploadMedia(data.light)
    }

    await mutateAsync({
      id: resourceData.id,
      event: data.event,
      link: data.link,
      dark: darkUrl,
      light: lightUrl,
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
            <h2 className="text-xl font-bold">Edit Resource</h2>
            <p>Form to edit the resource goes here.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center">
          <div className="max-w-2xl max-auto py-10 w-full">
            <ResourceForm
              isPending={isPending}
              initialData={resourceData}
              submitLabel="Save Changes"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
