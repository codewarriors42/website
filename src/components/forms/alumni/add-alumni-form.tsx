import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Trash2 } from 'lucide-react'
import { useAlumniForm } from './hooks/ctx'
import { AddSocialsUI } from './ui/alumin-socials'
import { RolesPicker } from '../member/ui/roles-picker'
import { SelectYearUI } from './ui/select-year'
import { FileUploadButton } from '#/components/shared/file-upload'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import type { Alumni } from '#/server/db/schemas/alumni/alumnis-type'
import { uploadFile } from '#/lib/file-uploads'
import { ErrorToast, SuccessToast } from '#/components/toast'

export function AddAlumniFormUI() {
  const {
    name,
    setName,
    year,
    setYear,
    post,
    setPost,
    socials,
    current,
    file,
    setFile,
    setCurrent,
    addSocial,
    removeSocial,
    resetForm,
  } = useAlumniForm()

  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.alumni.create.mutationOptions({
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
    const { fileId } = await uploadFile(file)
    const payload = {
      name,
      year,
      post,
      current,
      socials,
      image: fileId,
    }
    await mutateAsync(payload)
    resetForm()
  }
  return (
    <div className="max-w-md w-full">
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Create Alumni</h2>
          <p className="text-xs text-muted-foreground">
            Add alumni information and social links.
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
              placeholder="Enter alumni name"
            />
          </div>

          {/* Currently Doing */}
          <div className="space-y-2">
            <Label htmlFor="m-current">Currently Doing</Label>
            <Input
              id="m-current"
              type="text"
              value={current}
              onChange={(e) => setCurrent(e.currentTarget.value)}
              placeholder="Currently doing what?"
            />
          </div>

          <div className="flex items-center gap-3 justify-between py-2">
            <div className="space-y-2 w-full">
              <label htmlFor="alumni-year" className="text-xs">
                Year of Passing Out
              </label>
              <SelectYearUI value={year} onChange={setYear} />
            </div>

            {/* Roles */}
            <div className="w-full">
              <Label>Post</Label>
              <RolesPicker value={post} onChange={setPost} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Social Links</Label>
                <p className="text-xs text-muted-foreground">
                  Add social profiles for this alumni.
                </p>
              </div>

              <AddSocialsUI socials={socials} onChange={addSocial} />
            </div>

            {socials.length > 0 ? (
              <div className="flex gap-2 border-2 p-2 border-dotted rounded-lg tems-center max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border scrollbar-track-background">
                {socials.map((social) => (
                  <Badge
                    className="py-3 flex items-center justify-center "
                    variant={'outline'}
                    key={social.platform}
                  >
                    <span className="font-medium">{social.platform}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeSocial(social)}
                    >
                      <Trash2 className="h-2 w-2 text-destructive" />
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
              {isPending ? 'Loading...' : 'Create Alumni'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
