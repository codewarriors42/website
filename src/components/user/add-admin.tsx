import { UserPlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import AdminUserForm from './adminuser-form'
import type { AdminUserFormValues } from './adminuser-form'
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

  const handleSubmit = async (data: AdminUserFormValues) => {
    await mutateAsync({
      username: data.username,
      name: data.name,
      password: data.password ?? '',
      isSupreme: data.isSupreme ?? true,
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
            <h2 className="text-xl font-bold text-left">Add Admin</h2>
            <p>Form to add a new administrator account.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center px-4 sm:px-0 py-6">
          <div className="max-w-2xl mx-auto py-10 w-full px-4 sm:px-0 my-auto">
            <AdminUserForm
              isPending={isPending}
              submitLabel="Add Admin"
              onSubmit={handleSubmit}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
