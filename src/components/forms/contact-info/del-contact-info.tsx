import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { useRouter } from '@tanstack/react-router'
import { DeleteDialog } from '../shared/delete-dialog'

type Props = {
  contactInfoId: string
}

export function DeleteContactInfo({ contactInfoId }: Props) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.contact.delete.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.contact.getAll.queryKey(),
        })
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )

  const handleDelete = async () => {
    await mutateAsync({ id: contactInfoId })
  }

  return (
    <DeleteDialog
      title="Delete Contact Info?"
      description="This will permanently delete this contact info. Are you sure you want to continue?"
      onConfirm={handleDelete}
      isPending={isPending}
    />
  )
}
