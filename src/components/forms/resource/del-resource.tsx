import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { useRouter } from '@tanstack/react-router'
import { deleteFile } from '#/lib/file-uploads'
import { DeleteDialog } from '../shared/delete-dialog'

type Props = {
  darkImageId: string
  lightImageId: string
  resourceId: string
}
export function DeleteResource({
  resourceId,
  darkImageId,
  lightImageId,
}: Props) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.resource.delete.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.resource.getAll.queryKey(),
        })
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )
  const handleDelete = async () => {
    await mutateAsync({ id: resourceId })
    await deleteFile(darkImageId)
    await deleteFile(lightImageId)
  }

  return (
    <DeleteDialog
      title="Delete resource?"
      description="This will permanently delete this resource. Are you sure you want to continue?"
      onConfirm={handleDelete}
      isPending={isPending}
    />
  )
}
