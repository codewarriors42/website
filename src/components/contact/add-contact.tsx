import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { PencilIcon } from 'lucide-react'
import { XIcon } from '@phosphor-icons/react'
import { ContactForm } from './contact-from'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import type { ContactSchema } from '#/types/schemas/contact.schema'

export function AddContactForm() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.contact.create.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (value: ContactSchema) => {
    await mutateAsync({ ...value })
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
            <h2 className="text-xl font-bold text-left">Create Contact</h2>
            <p>Form to create a new contact message goes here.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center px-4 sm:px-0 py-6">
          <div className="max-w-2xl mx-auto py-10 w-full px-4 sm:px-0 my-auto">
            <ContactForm
              formMode="add"
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
