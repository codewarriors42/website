import { CircleNotchIcon, TrashIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { Button } from '../ui/button'

type DeleteMemberInput = { id: string }
export function DeleteContact({ info }: { info: DeleteMemberInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.contact.delete.mutationOptions({
      onError: (err) => {
        ErrorToast(err.message)
      },
      onSuccess: ({ message }) => {
        SuccessToast(message)
      },
    }),
  )

  const handleDelete = async () => {
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
