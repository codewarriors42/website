import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import type { Resource } from '#/types/schemas/resource.schema'
import { CircleNotchIcon } from '@phosphor-icons/react'
import { MediaImage } from '../media-image'
import { uploadMedia } from '#/utils/media-handler'

interface ResourceFormState extends Omit<Resource, 'dark' | 'light'> {
  dark: File | string | null
  light: File | string | null
}

interface ResourceFormProps {
  initialData?: Resource & { id?: string }
  onSubmit: (data: Resource) => void
  submitLabel?: string
  isPending?: boolean
}

export function ResourceForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isPending = false,
}: ResourceFormProps) {
  const [inputState, setInputState] = useState<ResourceFormState>(
    initialData || {
      event: '',
      link: '',
      dark: null,
      light: null,
    },
  )
  const [darkPreviewSrc, setDarkPreviewSrc] = useState('')
  const [darkPreviewImage, setDarkPreviewImage] = useState('')
  const [lightPreviewSrc, setLightPreviewSrc] = useState('')
  const [lightPreviewImage, setLightPreviewImage] = useState('')

  useEffect(() => {
    const { dark } = inputState
    if (dark instanceof File) {
      const url = URL.createObjectURL(dark)
      setDarkPreviewSrc(url)
      setDarkPreviewImage('')
      return () => {
        URL.revokeObjectURL(url)
      }
    }

    if (typeof dark === 'string' && dark.length > 0) {
      setDarkPreviewSrc('')
      setDarkPreviewImage(dark)
      return
    }

    setDarkPreviewSrc('')
    setDarkPreviewImage('')
  }, [inputState.dark])

  useEffect(() => {
    const { light } = inputState
    if (light instanceof File) {
      const url = URL.createObjectURL(light)
      setLightPreviewSrc(url)
      setLightPreviewImage('')
      return () => {
        URL.revokeObjectURL(url)
      }
    }

    if (typeof light === 'string' && light.length > 0) {
      setLightPreviewSrc('')
      setLightPreviewImage(light)
      return
    }

    setLightPreviewSrc('')
    setLightPreviewImage('')
  }, [inputState.light])

  const handleReset = () => {
    setInputState(
      initialData || {
        event: '',
        link: '',
        dark: null,
        light: null,
      },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let darkUrl = typeof inputState.dark === 'string' ? inputState.dark : null
    let lightUrl =
      typeof inputState.light === 'string' ? inputState.light : null

    if (inputState.dark instanceof File) {
      darkUrl = await uploadMedia(inputState.dark)
    }

    if (inputState.light instanceof File) {
      lightUrl = await uploadMedia(inputState.light)
    }

    const resourceData: Resource = {
      event: inputState.event,
      link: inputState.link,
      dark: darkUrl,
      light: lightUrl,
    }

    onSubmit(resourceData)
    if (!initialData) handleReset()
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-2 pb-5">
        <label
          htmlFor="resource-event"
          className="text-md text-muted-foreground"
        >
          Event
        </label>

        <Input
          id="resource-event"
          name="event"
          className="placeholder:capitalize rounded-none px-3 py-5 w-full"
          placeholder="Event Name"
          value={inputState.event}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState({
              ...inputState,
              event: val,
            })
          }}
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label
          htmlFor="resource-link"
          className="text-md text-muted-foreground"
        >
          Link
        </label>

        <Input
          id="resource-link"
          name="link"
          type="url"
          className="placeholder:capitalize rounded-none px-3 py-5 w-full"
          placeholder="https://example.com"
          value={inputState.link}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState({
              ...inputState,
              link: val,
            })
          }}
        />
      </div>

      <div className="grid gap-3">
        <label
          htmlFor="resource-dark"
          className="text-md text-muted-foreground"
        >
          Dark Theme Image
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {darkPreviewSrc ? (
            <img
              src={darkPreviewSrc}
              alt="Dark theme preview"
              className="h-24 w-24 object-cover border border-muted"
              loading="lazy"
            />
          ) : null}
          {darkPreviewImage ? (
            <MediaImage
              image={darkPreviewImage}
              name={inputState.event || 'Resource'}
              className="h-24 w-24 object-cover border border-muted"
            />
          ) : null}

          <Input
            type="file"
            id="resource-dark"
            name="dark"
            accept="image/*,.svg"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              if (file) {
                setInputState((prev) => ({ ...prev, dark: file }))
              }
            }}
            className="rounded-none flex-1 px-3 py-2.5 h-14 file:mr-3 file:border-0 file:bg-muted file:w-fit file:h-fit file:p-3 file:py-2 file:text-md file:font-medium file:text-foreground"
          />
        </div>
      </div>

      <div className="grid gap-3">
        <label
          htmlFor="resource-light"
          className="text-md text-muted-foreground"
        >
          Light Theme Image
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {lightPreviewSrc ? (
            <img
              src={lightPreviewSrc}
              alt="Light theme preview"
              className="h-24 w-24 object-cover border border-muted"
              loading="lazy"
            />
          ) : null}
          {lightPreviewImage ? (
            <MediaImage
              image={lightPreviewImage}
              name={inputState.event || 'Resource'}
              className="h-24 w-24 object-cover border border-muted"
            />
          ) : null}

          <Input
            type="file"
            id="resource-light"
            name="light"
            accept="image/*,.svg"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              if (file) {
                setInputState((prev) => ({ ...prev, light: file }))
              }
            }}
            className="rounded-none flex-1 px-3 py-2.5 h-14 file:mr-3 file:border-0 file:bg-muted file:w-fit file:h-fit file:p-3 file:py-2 file:text-md file:font-medium file:text-foreground"
          />
        </div>
      </div>

      <div className="mt-6 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto w-full max-w-lg">
        <Button
          disabled={isPending}
          type="reset"
          onClick={() => {
            handleReset()
          }}
          variant={'outline'}
          className="rounded-none cursor-pointer w-full sm:w-1/2 h-10 py-2 text-sm"
        >
          Reset
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          className="rounded-none w-full sm:w-1/2 h-10 py-2 text-sm"
        >
          {isPending ? (
            <CircleNotchIcon size={20} className="animate-spin" />
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
