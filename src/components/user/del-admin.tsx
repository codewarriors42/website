import { CircleNotchIcon, TrashIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { Button } from '../ui/button'

type DeleteUserInput = { id: string }
export function RemoveUser({ info }: { info: DeleteUserInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.auth.delete.mutationOptions({
      onError: (err) => {
        ErrorToast(err.message || 'Something went wrong !!')
      },
      onSuccess: ({ message }) => {
        SuccessToast(message)
      },
    }),
  )

  const handleDelete = async () => {
    const ok = window.confirm('Are you sure you want to delete this user?')
    if (!ok) return
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
        <TrashIcon weight="bold" className="mr-1 text-red-500" />
      )}
    </Button>
  )
}

export default RemoveUser
