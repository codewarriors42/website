import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { useRouter } from '@tanstack/react-router'
import { deleteFile } from '#/lib/file-uploads'
import { DeleteDialog } from '../shared/delete-dialog'

type Props = {
  imageId: string
  memberId: string
}

export function DeleteMember({ memberId, imageId }: Props) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.member.delete.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.member.getAll.queryKey(),
        })
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )

  const handleDelete = async () => {
    await mutateAsync({ id: memberId })
    await deleteFile(imageId)
  }

  return (
    <DeleteDialog
      title="Delete member?"
      description="This will permanently delete this member. Are you sure you want to continue?"
      onConfirm={handleDelete}
      isPending={isPending}
    />
  )
}
