import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { useRouter } from '@tanstack/react-router'
import { deleteFile } from '#/lib/file-uploads'
import { DeleteDialog } from '../shared/delete-dialog'

type Props = {
  imageId: string
  archiveId: string
}

export function DeleteArchive({ archiveId, imageId }: Props) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.archive.delete.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.archive.getAll.queryKey(),
        })
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )

  const handleDelete = async () => {
    await mutateAsync({ id: archiveId })
    await deleteFile(imageId)
  }

  return (
    <DeleteDialog
      title="Delete archive?"
      description="This will permanently delete this archive. Are you sure you want to continue?"
      onConfirm={handleDelete}
      isPending={isPending}
    />
  )
}
