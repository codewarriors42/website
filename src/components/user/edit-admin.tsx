import { PencilIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { AuthForm } from './adminuser-form'
import type { FormSchema } from './adminuser-form'

export function EditUser({ userData }: { userData: FormSchema }) {
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

  const handleSubmit = async (data: FormSchema) => {
    console.log(data)
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
          <div className="max-w-md mx-auto py-10 w-full px-4 sm:px-0 my-auto">
            <AuthForm
              initaldata={userData}
              mode="edit_admin_user"
              handler={handleSubmit}
              isLoading={isPending}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}

export default EditUser
