import { CircleNotchIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { Button } from '../ui/button'

type MoveMemberToAlumniInput = { id: string }
export function MoveMemberToAlumni({
  info,
}: {
  info: MoveMemberToAlumniInput
}) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.members.moveToAlumni.mutationOptions({
      onError: (err) => {
        ErrorToast(err.message)
      },
      onSuccess: ({ message }) => {
        SuccessToast(message)
      },
    }),
  )

  const handleMoveToAlumni = async () => {
    await mutateAsync({ id: info.id })
  }
  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={handleMoveToAlumni}
      className="flex items-center justify-center py-4 px-7 cursor-pointer rounded-none"
      variant={'outline'}
    >
      {isPending ? (
        <CircleNotchIcon weight="bold" className="animate-spin text-primary" />
      ) : (
        <>
          <p className="mr-2">Move to Alumni</p>
        </>
      )}
    </Button>
  )
}
