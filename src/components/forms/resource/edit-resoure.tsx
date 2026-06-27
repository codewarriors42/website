import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { resourceSchema } from '#/server/db/schemas/resource/resource-type'
import type {
  ResourceType,
  ResourceTypeWithId,
} from '#/server/db/schemas/resource/resource-type'
import { FileUploadButton } from '#/components/shared/file-upload'
import { Label } from '#/components/ui/label'
import { useState } from 'react'
import { deleteFile, getMediaUrl, uploadFile } from '#/lib/file-uploads'
import { useRouter } from '@tanstack/react-router'

export function EditResourceUI({ resource }: { resource: ResourceTypeWithId }) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient
  const [fileDark, setFileDark] = useState<File | null>(null)
  const [fileLight, setFileLight] = useState<File | null>(null)
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.resource.update.mutationOptions({
      onSuccess: async (d) => {
        SuccessToast(d.message)
        await queryClient.invalidateQueries({
          queryKey: trpc.resource.getById.queryKey({ id: resource.id }),
        })
      },
      onError: (e) => {
        ErrorToast(e.message)
      },
    }),
  )
  const form = useForm({
    defaultValues: {
      dark: '',
      light: '',
      link: resource.link,
      event: resource.event,
    },
    validators: {
      onSubmit: resourceSchema,
    },
    onSubmit: async ({ value }) => {
      if (fileDark && fileLight) {
        const darkFile = await uploadFile(fileDark)
        const lightFile = await uploadFile(fileLight)
        const resourceData = {
          ...value,
          dark: darkFile.fileId,
          light: lightFile.fileId,
          id: resource.id,
        }
        await mutateAsync(resourceData)
        await deleteFile(resource.dark)
        await deleteFile(resource.light)
        resetFiles()
        form.reset()
      } else if (fileDark) {
        const darkFile = await uploadFile(fileDark)
        const resourceData = {
          ...value,
          dark: darkFile.fileId,
          light: resource.light,
          id: resource.id,
        }
        await mutateAsync(resourceData)
        await deleteFile(resource.dark)
        resetFiles()
        form.reset()
      } else if (fileLight) {
        const lightFile = await uploadFile(fileLight)
        const resourceData = {
          ...value,
          dark: resource.dark,
          light: lightFile.fileId,
          id: resource.id,
        }
        await mutateAsync(resourceData)
        await deleteFile(resource.light)
        resetFiles()
        form.reset()
      } else {
        const resourceData = {
          ...value,
          dark: resource.dark,
          light: resource.light,
          id: resource.id,
        }
        await mutateAsync(resourceData)
        resetFiles()
        form.reset()
      }
    },
  })
  const resetFiles = () => {
    setFileDark(null)
    setFileLight(null)
  }
  return (
    <div className="max-w-md w-full">
      <form
        id="faq_form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field
            name="event"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Event</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter your event"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="link"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Resource Link</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter resource link"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="dark">Dark Image</Label>
            <FileUploadButton
              file={fileDark}
              onFileSelect={setFileDark}
              previewUrl={getMediaUrl(resource.dark)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="light">Light Image</Label>
            <FileUploadButton
              file={fileLight}
              onFileSelect={setFileLight}
              previewUrl={getMediaUrl(resource.light)}
            />
          </div>
        </FieldGroup>
        <div className="grid grid-cols-2 gap-3 mt-5 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              resetFiles()
            }}
          >
            Reset
          </Button>
          <Button type="submit" form="faq_form">
            {isPending ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
