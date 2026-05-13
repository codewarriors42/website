import { Button } from '../ui/button'
import Sheet from '../ui/sheet'
import { PencilIcon } from 'lucide-react'
import { XIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '../toast'
import { FAQForm } from './faq-form'
import type { FAQSchema } from '#/types/schemas/faq.schema'

export function AddFAQForm() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.faqs.create.mutationOptions({
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
      onError: (err) => {
        ErrorToast(err.message)
      },
    }),
  )

  const handleSubmit = async (value: FAQSchema) => {
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
        <Sheet.Header className="flex items-center border-b">
          <div className="p-5 w-full">
            <h2 className="text-xl font-bold">Create FAQ</h2>
            <p>Form to create a new FAQ goes here.</p>
          </div>
          <div className="h-full flex items-center justify-center p-5">
            <Sheet.Close className="border p-2 cursor-pointer">
              <XIcon size={20} weight="bold" />
            </Sheet.Close>
          </div>
        </Sheet.Header>
        <Sheet.Body className="w-full h-full overflow-y-auto flex justify-center">
          <div className="max-w-2xl max-auto py-10 w-full">
            <FAQForm
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
