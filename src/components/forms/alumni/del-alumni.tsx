import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { useRouter } from '@tanstack/react-router'
import { deleteFile } from '#/lib/file-uploads'
import { DeleteDialog } from '../shared/delete-dialog'

type Props = {
  alumniId: string
  imageId: string
}

export function DeleteAlumni({ alumniId, imageId }: Props) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.alumni.delete.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.alumni.getAll.queryKey(),
        })
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )

  const handleDelete = async () => {
    await mutateAsync({ id: alumniId })
    await deleteFile(imageId)
  }

  return (
    <DeleteDialog
      title="Delete alumni?"
      description="This will permanently delete this alumni. Are you sure you want to continue?"
      onConfirm={handleDelete}
      isPending={isPending}
    />
  )
}
