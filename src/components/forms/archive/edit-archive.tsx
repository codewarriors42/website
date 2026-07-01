import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { SelectYearUI } from '../alumni/ui/select-year'
import { useArchiveForm } from './hooks/ctx'
import { FileUploadButton } from '#/components/shared/file-upload'
import { SelectCategoryUI } from './ui/select-category'
import { AddArchiveSocialsUI } from './ui/archive-socials'
import { SelectArchiveEventUI } from './ui/select-event'
import { AddArchiveContributerUI } from './ui/add-contributer'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { deleteFile, getMediaUrl, uploadFile } from '#/lib/file-uploads'
import type { ArchiveTypeWithId } from '#/server/db/schemas/archive/archive-type'
import { SocialLinksDisplay } from '../shared/social-links-display'

export function EditArchiveFormUI() {
  const {
    title,
    setTitle,
    competition,
    setCompetition,
    year,
    setYear,
    socials,
    category,
    contributors,
    addContributor,
    addSocial,
    setCategory,
    event,
    setEvent,
    removeContributor,
    removeSocial,
    archiveId,
    previewUrl,
    file,
    setFile,
    resetForm,
  } = useArchiveForm()
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.archive.update.mutationOptions({
      onSuccess: (d) => {
        SuccessToast(d.message)
      },
      onError: (e) => {
        ErrorToast(e.message)
      },
    }),
  )
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!archiveId) {
      ErrorToast('Archive ID is missing')
      return
    }

    if (file) {
      const { fileId } = await uploadFile(file)
      const payload = {
        id: archiveId,
        title,
        competition,
        year,
        category,
        event,
        contributors,
        links: socials,
        image: fileId,
      } as ArchiveTypeWithId
      await mutateAsync(payload)
      await deleteFile(previewUrl ?? '')
    } else {
      const payload = {
        id: archiveId,
        title,
        competition,
        year,
        category,
        event,
        contributors,
        links: socials,
        image: previewUrl ?? '',
      } as ArchiveTypeWithId
      await mutateAsync(payload)
    }
  }

  return (
    <div className="max-w-md w-full">
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Edit Archive</h2>
          <p className="text-xs text-muted-foreground">
            Update archive information and social links.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="m-title">Title</Label>
            <Input
              id="m-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="Enter title"
            />
          </div>

          {/* Competition Name */}
          <div className="space-y-2">
            <Label htmlFor="m-competition">Competition Name</Label>
            <Input
              id="m-competition"
              type="text"
              value={competition}
              onChange={(e) => setCompetition(e.currentTarget.value)}
              placeholder="Enter competition name"
            />
          </div>

          <div className="flex items-center gap-3 justify-between py-2">
            <div className="space-y-2 w-full">
              <label htmlFor="alumni-year" className="text-xs">
                Year
              </label>
              <SelectYearUI value={year} onChange={setYear} />
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="alumni-year" className="text-xs">
                Category
              </label>
              <SelectCategoryUI value={category} onChange={setCategory} />
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="alumni-year" className="text-xs">
                Event
              </label>
              <SelectArchiveEventUI value={event} onChange={setEvent} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Social Links</Label>
                <p className="text-xs text-muted-foreground">
                  Add social profiles for this archive.
                </p>
              </div>

              <AddArchiveSocialsUI socials={socials} onChange={addSocial} />
            </div>

            <SocialLinksDisplay
              socials={socials}
              onRemove={(social) => removeSocial(social.platform)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Contributers</Label>
                <p className="text-xs text-muted-foreground">
                  Add contributers for this archive.
                </p>
              </div>

              <AddArchiveContributerUI onChange={addContributor} />
            </div>

            <SocialLinksDisplay
              socials={contributors}
              onRemove={(social) => removeContributor(social)}
              emptyMessage="No contributers added yet"
              renderPlatform={(social) => social}
            />
          </div>
          {/* Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <FileUploadButton
              onFileSelect={setFile}
              file={file}
              previewUrl={getMediaUrl(previewUrl ?? '')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>

            <Button type="submit">
              {isPending ? 'Loading...' : 'Create Archive'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
