import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '#/integrations/trpc/react'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { CircleNotchIcon } from '@phosphor-icons/react'
import { MediaImage } from '../media-image'
import type { Archive, ArchivePlatform } from '#/types/schemas/archive.schema'
import { uploadMedia } from '#/utils/media-handler'

interface ArchiveFormProps {
  initialData?: Archive & { id?: string }
  onSubmit: (data: Archive) => void
  submitLabel?: string
  isPending?: boolean
}

const platforms: ArchivePlatform[] = [
  'github',
  'youtube',
  'behance',
  'dribbble',
  'google_drive',
  'figma',
]

function EventSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const trpc = useTRPC()
  const { data: events = [], isLoading } = useQuery(
    trpc.event.getAll.queryOptions(),
  )

  return (
    <Select name="event" value={value || ''} onValueChange={(v) => onChange(v)}>
      <SelectTrigger id="archive-event" className="w-full rounded-none">
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'Select the event'}
        />
      </SelectTrigger>
      <SelectContent className="rounded-none">
        <SelectGroup>
          <SelectLabel>Event</SelectLabel>
          {events.map((ev: any) => (
            <SelectItem
              key={ev._id?.toString() ?? ev._id}
              value={ev._id?.toString() ?? ev._id}
              className="rounded-none px-2"
            >
              {ev.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function ArchiveForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isPending = false,
}: ArchiveFormProps) {
  const now = new Date().getFullYear()

  const defaultState: Archive = {
    title: '',
    competition: '',
    links: [],
    category: 'creative_work',
    event: '',
    contributors: '',
    year: now,
    image: null,
  }

  const [inputState, setInputState] = useState<Archive>(
    initialData ?? defaultState,
  )
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    const { image } = inputState
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setPreviewSrc(url)
      setPreviewImage('')
      return () => URL.revokeObjectURL(url)
    }

    if (typeof image === 'string' && image.length > 0) {
      setPreviewSrc('')
      setPreviewImage(image)
      return
    }

    setPreviewSrc('')
    setPreviewImage('')
  }, [inputState.image])

  const handleReset = () => {
    setInputState(initialData ?? defaultState)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let imageUrl: string | null =
      typeof inputState.image === 'string' ? inputState.image : null

    if (inputState.image instanceof File) {
      imageUrl = await uploadMedia(inputState.image)
    }

    const cleanedLinks = inputState.links.filter(
      (l) => l.url && l.url.trim().length > 0,
    )

    const data: Archive = {
      title: inputState.title,
      competition: inputState.competition,
      links: cleanedLinks,
      category: inputState.category,
      event: inputState.event,
      contributors: inputState.contributors,
      year: inputState.year,
      image: imageUrl,
    }

    onSubmit(data)
    if (!initialData) handleReset()
  }

  return (
    <form
      className="grid gap-3 max-w-3xl w-full mx-auto px-4 sm:px-0"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2 pb-5">
        <label
          htmlFor="archive-title"
          className="text-md text-muted-foreground"
        >
          Title
        </label>
        <Input
          id="archive-title"
          name="title"
          className="rounded-none px-3 py-5 w-full"
          placeholder="Project Title"
          value={inputState.title}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState((prev) => ({ ...prev, title: val }))
          }}
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label
          htmlFor="archive-competition"
          className="text-md text-muted-foreground"
        >
          Competition
        </label>
        <Input
          id="archive-competition"
          name="competition"
          className="rounded-none px-3 py-5 w-full"
          placeholder="Competition name"
          value={inputState.competition}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState((prev) => ({ ...prev, competition: val }))
          }}
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label
          htmlFor="archive-category"
          className="text-md text-muted-foreground"
        >
          Category
        </label>
        <Select
          name="category"
          value={inputState.category}
          onValueChange={(value) =>
            setInputState((prev) => ({
              ...prev,
              category: value as Archive['category'],
            }))
          }
        >
          <SelectTrigger id="archive-category" className="w-full rounded-none">
            <SelectValue placeholder="Select the category" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="creative_work" className="rounded-none px-2">
                Creative Work
              </SelectItem>
              <SelectItem value="creative_prompt" className="rounded-none px-2">
                Creative Prompt
              </SelectItem>
              <SelectItem value="quizzes" className="rounded-none px-2">
                Quizzes
              </SelectItem>
              <SelectItem value="crossword" className="rounded-none px-2">
                Crossword
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 pb-5">
        <label
          htmlFor="archive-event"
          className="text-md text-muted-foreground"
        >
          Event
        </label>
        <EventSelect
          value={inputState.event}
          onChange={(val) => setInputState((prev) => ({ ...prev, event: val }))}
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label
          htmlFor="archive-contributors"
          className="text-md text-muted-foreground"
        >
          Contributors
        </label>
        <Input
          id="archive-contributors"
          name="contributors"
          className="rounded-none px-3 py-5 w-full"
          placeholder="Comma separated contributor names"
          value={inputState.contributors}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState((prev) => ({ ...prev, contributors: val }))
          }}
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label htmlFor="archive-year" className="text-md text-muted-foreground">
          Year
        </label>
        <Select
          name="year"
          value={inputState.year.toString()}
          onValueChange={(value) =>
            setInputState((prev) => ({ ...prev, year: parseInt(value) }))
          }
        >
          <SelectTrigger id="archive-year" className="w-full rounded-none">
            <SelectValue placeholder="Select the year" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {Array.from(
                { length: new Date().getFullYear() - 1997 + 1 },
                (_, i) => {
                  const year = 1997 + i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                },
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <label
          htmlFor="archive-image"
          className="text-md text-muted-foreground"
        >
          Image
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Preview"
              className="h-24 w-24 object-cover border border-muted"
              loading="lazy"
            />
          ) : null}
          {previewImage ? (
            <MediaImage
              image={previewImage}
              name={inputState.title || 'Archive'}
              className="h-24 w-24 object-cover border border-muted"
            />
          ) : null}

          <Input
            type="file"
            id="archive-image"
            name="image"
            accept="image/*,.svg"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] || null
              setInputState((prev) => ({ ...prev, image: file }))
            }}
            className="rounded-none flex-1 px-3 py-2.5 h-14 file:mr-3 file:border-0 file:bg-muted file:w-fit file:h-fit file:p-3 file:py-2 file:text-md file:font-medium file:text-foreground"
          />
        </div>
      </div>

      <div className="pt-5 pb-5">
        <p className="text-md text-muted-foreground py-3">Links</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {platforms.map((p) => (
            <div key={p} className="grid gap-1">
              <label
                htmlFor={`link-${p}`}
                className="text-xs text-muted-foreground capitalize"
              >
                {p}
              </label>
              <Input
                id={`link-${p}`}
                name={`link-${p}`}
                type="url"
                placeholder="https://example.com"
                className="rounded-none px-3 py-5 w-full"
                value={
                  inputState.links.find((item) => item.platform === p)?.url ??
                  ''
                }
                onChange={(e) => {
                  const val = e.currentTarget.value
                  setInputState((prev) => {
                    const next = [...prev.links]
                    const idx = next.findIndex((item) => item.platform === p)

                    if (idx >= 0) {
                      next[idx] = { ...next[idx], url: val }
                    } else {
                      next.push({ platform: p, url: val })
                    }

                    return { ...prev, links: next }
                  })
                }}
              />
            </div>
          ))}
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
