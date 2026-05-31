import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import AdminUserForm from './adminuser-form'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'

type UpdateUserInput = {
  id: string
  username: string
  name: string
  password?: string
  isSupreme?: boolean
}

export function EditUser({ userData }: { userData: UpdateUserInput }) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.auth.update.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (data: any) => {
    if (!userData.id) {
      ErrorToast('Missing user id')
      return
    }
    await mutateAsync({ ...data, id: userData.id })
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
            <h2 className="text-xl font-bold text-left">Edit User</h2>
            <p>Modify administrator account details.</p>
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
              initialData={{
                id: userData.id,
                username: userData.username,
                name: userData.name,
                isSupreme: userData.isSupreme,
              }}
              isEditForm={true}
              isPending={isPending}
              submitLabel="Save Changes"
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}

export default EditUser
