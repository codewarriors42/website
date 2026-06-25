import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

import { FileUploadButton } from '@/components/shared/file-upload'
import { RolesPicker } from './ui/roles-picker'
import { SelectGradeUI } from './ui/select-grade'
import { AddSocialsUI } from './ui/socials'

import { useMemberForm } from './hooks/ctx'

import { useTRPC } from '@/integrations/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteFile, getMediaUrl, uploadFile } from '@/lib/file-uploads'
import { ErrorToast, SuccessToast } from '@/components/toast'

import { Trash2 } from 'lucide-react'

import type { MemberSocials } from '#/server/db/schemas/member/member-type'
import { useRouter } from '@tanstack/react-router'

export function EditMemberFormUI() {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const {
    roles,
    setRoles,
    name,
    file,
    previewUrl,
    setFile,
    setName,
    grade,
    setGrade,
    socials,
    setSocials,
    addSocial,
    resetForm,
    memberId,
  } = useMemberForm()

  const trpc = useTRPC()

  const { mutateAsync, isPending } = useMutation(
    trpc.member.update.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.member.getSingleMemberByID.queryKey({ id: memberId }),
        })
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!memberId) {
      ErrorToast('Member ID not found')
      return
    }

    if (file) {
      const data = await uploadFile(file)
      const payload = {
        id: memberId,
        name,
        grade,
        roles,
        socials,
        image: data.fileId,
      }
      await mutateAsync(payload)
      await deleteFile(previewUrl ?? '')
    } else {
      const payload = {
        id: memberId,
        name,
        grade,
        roles,
        socials,
        image: previewUrl ?? '',
      }
      await mutateAsync(payload)
    }
  }

  const removeSocial = (platform: MemberSocials) => {
    setSocials((prev) => prev.filter((s) => s.platform !== platform))
  }

  return (
    <div className="max-w-md w-full">
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Edit Member</h2>

          <p className="text-xs text-muted-foreground">
            Update member information and social links.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="m-name">Name</Label>

            <Input
              id="m-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter member name"
            />
          </div>

          {/* Grade + Roles */}
          <div className="flex items-center gap-3 justify-between py-2">
            <div className="space-y-2">
              <Label>Grade</Label>

              <SelectGradeUI onChange={setGrade} value={grade} />
            </div>

            <div className="space-y-2 w-full">
              <Label>Roles</Label>

              <RolesPicker value={roles} onChange={setRoles} />
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Social Links</Label>

                <p className="text-xs text-muted-foreground">
                  Update social profiles for this member.
                </p>
              </div>

              <AddSocialsUI socials={socials} onChange={addSocial} />
            </div>

            {socials.length > 0 ? (
              <div className="flex flex-wrap gap-2 border-2 border-dotted rounded-lg p-2">
                {socials.map((social) => (
                  <Badge
                    key={social.platform}
                    variant="outline"
                    className="py-3 flex items-center gap-1"
                  >
                    <span className="font-medium">{social.platform}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="h-5 w-5"
                      onClick={() => removeSocial(social.platform)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  No social links added yet
                </p>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Profile Image</Label>

            <FileUploadButton
              previewUrl={getMediaUrl(previewUrl ?? '')}
              onFileSelect={setFile}
              file={file}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>

            <Button type="submit">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
