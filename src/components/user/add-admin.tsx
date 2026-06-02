import { UserPlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { AuthForm } from './adminuser-form'
import type { FormSchema } from './adminuser-form'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'

export function AddAdmin() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.auth.create.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: FormSchema) => {
    await mutateAsync({
      username: data.username,
      name: data.name!,
      password: data.password!,
      isSupreme: data.isSuperme,
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
            <h2 className="text-2xl font-semibold text-left">Add Admin</h2>
            <p className="text-sm text-muted-foreground">
              Form to add a new administrator account.
            </p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="p-2 rounded-md border border-input hover:bg-muted/10 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center px-4 sm:px-0 py-6">
          <div className="max-w-md mx-auto w-full px-4 sm:px-0 my-auto">
            <AuthForm
              handler={handleSubmit}
              mode="create_admin_user"
              isLoading={isPending}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
