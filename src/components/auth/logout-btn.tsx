import { CircleNotchIcon, SignOutIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ErrorToast, SuccessToast } from '../toast'
import { Button } from '../ui/button'

export function LogoutBtn() {
  const navtigate = useNavigate()
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.auth.logout.mutationOptions({
      onError: () => {
        ErrorToast('Something went wrong !!')
      },
      onSuccess: ({ message }) => {
        SuccessToast(message)
      },
    }),
  )

  const handleLogout = async () => {
    await mutateAsync()
    navtigate({ to: '/login' })
  }
  return (
    <Button
      disabled={isPending}
      onClick={handleLogout}
      className="flex items-center justify-center py-5 px-7 cursor-pointer"
      variant={'outline'}
    >
      {isPending ? (
        <CircleNotchIcon weight="bold" className="animate-spin text-primary" />
      ) : (
        <>
          <SignOutIcon weight="bold" className="mr-1 text-red-500" />
          <p className="text-sm">Logout</p>
        </>
      )}
    </Button>
  )
}
