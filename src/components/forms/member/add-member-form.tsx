import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useMemberForm } from './hooks/ctx'
import { FileUploadButton } from '#/components/shared/file-upload'
import { RolesPicker } from './ui/roles-picker'
import { SelectGradeUI } from './ui/select-grade'
import { AddSocialsUI } from './ui/socials'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { uploadFile } from '#/lib/file-uploads'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { SocialLinksDisplay } from '../shared/social-links-display'

export function AddMemberFormUI() {
  const {
    roles,
    setRoles,
    name,
    file,
    setFile,
    setName,
    grade,
    removeSocial,
    setGrade,
    socials,
    addSocial,
    resetForm,
  } = useMemberForm()

  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.member.create.mutationOptions({
      onSuccess: (d) => {
        SuccessToast(d.message)
      },
      onError: (d) => {
        ErrorToast(d.message)
      },
    }),
  )
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!file) {
      alert('provide the file plx')
      return
    }
    const data = await uploadFile(file)
    const payload = {
      name,
      grade,
      roles,
      socials,
      image: data.fileId,
    }
    await mutateAsync({ ...payload })
    resetForm()
  }
  return (
    <div className="max-w-md w-full">
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Create Member</h2>
          <p className="text-xs text-muted-foreground">
            Add member information and social links.
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

          <div className="flex items-center gap-3 justify-between py-2">
            {/* Grade */}
            <div className="space-y-2">
              <Label>Grade</Label>
              <SelectGradeUI onChange={setGrade} value={grade} />
            </div>

            {/* Roles */}
            <div className="space-y-2 w-full">
              <Label>Roles</Label>
              <RolesPicker value={roles} onChange={setRoles} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Social Links</Label>
                <p className="text-xs text-muted-foreground">
                  Add social profiles for this member.
                </p>
              </div>

              <AddSocialsUI socials={socials} onChange={addSocial} />
            </div>

            <SocialLinksDisplay
              socials={socials}
              onRemove={(social) => removeSocial(social.platform)}
            />
          </div>
          {/* Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <FileUploadButton onFileSelect={setFile} file={file} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>

            <Button type="submit">
              {isPending ? 'Saving...' : 'Create Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
