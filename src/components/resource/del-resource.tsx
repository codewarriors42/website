import { CircleNotchIcon, TrashIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { Button } from '../ui/button'
import { deleteMedia } from '#/utils/media-handler'

type DeleteResourceInput = { id: string; dark: string; light: string }
export function DeleteResource({ info }: { info: DeleteResourceInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.resources.delete.mutationOptions({
      onError: (err) => {
        ErrorToast(err.message)
      },
      onSuccess: ({ message }) => {
        SuccessToast(message)
      },
    }),
  )

  const handleDelete = async () => {
    await deleteMedia(info.dark)
    await deleteMedia(info.light)
    await mutateAsync({ id: info.id })
  }
  return (
    <Button
      disabled={isPending}
      onClick={handleDelete}
      className="flex items-center justify-center py-5 px-7 cursor-pointer"
      variant={'outline'}
    >
      {isPending ? (
        <CircleNotchIcon weight="bold" className="animate-spin text-primary" />
      ) : (
        <>
          <TrashIcon weight="bold" className="mr-1 text-red-500" />
        </>
      )}
    </Button>
  )
}
