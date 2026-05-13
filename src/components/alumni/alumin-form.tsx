import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { memberRoles } from '#/types/schemas/member.schema'
import type { MemberRole } from '#/types/schemas/member.schema'
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
import { alumniSocialPlatforms } from '#/types/schemas/alumni.schema'
import type { Alumni } from '#/types/schemas/alumni.schema'

interface AlumniFormProps {
  initialData?: Alumni
  onSubmit: (data: Alumni) => void
  submitLabel?: string
  isPending?: boolean
}

export function AlumniForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isPending = false,
}: AlumniFormProps) {
  const [roles, setRoles] = useState<MemberRole[]>(initialData?.post || [])
  const [inputState, setInputState] = useState<Alumni>(
    initialData || {
      current: '',
      name: '',
      post: [],
      year: new Date().getFullYear(),
      socials: [
        { platform: 'email', url: '' },
        { platform: 'github', url: '' },
        { platform: 'linkedin', url: '' },
        { platform: 'twitter', url: '' },
        { platform: 'instagram', url: '' },
      ],
      image: null,
    },
  )
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    const { image } = inputState
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setPreviewSrc(url)
      setPreviewImage('')
      return () => {
        URL.revokeObjectURL(url)
      }
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
    setRoles(initialData?.post || [])
    setInputState(
      initialData || {
        post: [],
        name: '',
        year: new Date().getFullYear(),
        current: '',
        socials: [
          { platform: 'email', url: '' },
          { platform: 'github', url: '' },
          { platform: 'linkedin', url: '' },
          { platform: 'twitter', url: '' },
          { platform: 'instagram', url: '' },
          { platform: 'website', url: '' },
          { platform: 'youtube', url: '' },
          { platform: 'dribbble', url: '' },
          { platform: 'behance', url: '' },
          { platform: 'discord', url: '' },
        ],
        image: null,
      },
    )
  }
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        const cleanedSocials = inputState.socials.filter(
          (social) => social.url.trim().length > 0,
        )
        onSubmit({ ...inputState, post: roles, socials: cleanedSocials })
        if (!initialData) handleReset()
        if (e.target instanceof HTMLFormElement) {
          e.target.reset()
        }
      }}
    >
      <div className="grid gap-2 pb-5">
        <label htmlFor="alumni-name" className="text-md text-muted-foreground">
          Name
        </label>

        <Input
          id="alumni-name"
          name="name"
          className="rounded-none px-3 py-5"
          placeholder="Alumni Name"
          autoComplete="name"
          value={inputState.name}
          onChange={(e) =>
            setInputState({
              ...inputState,
              name: e.currentTarget.value,
            })
          }
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label
          htmlFor="alumni-current"
          className="text-md text-muted-foreground"
        >
          Currentl Doing / Position
        </label>

        <Input
          id="alumni-current"
          name="current"
          className="rounded-none px-3 py-5"
          placeholder="Current Position / Doing"
          autoComplete="organization-title"
          value={inputState.current}
          onChange={(e) =>
            setInputState({
              ...inputState,
              current: e.currentTarget.value,
            })
          }
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label htmlFor="alumni-year" className="text-md text-muted-foreground">
          Year of Graduation
        </label>
        <Select
          name="year"
          value={inputState.year.toString()}
          onValueChange={(value) =>
            setInputState((prev) => ({ ...prev, year: parseInt(value) }))
          }
        >
          <SelectTrigger
            id="alumni-year"
            className="w-full max-w-48 rounded-none"
          >
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
          htmlFor="alumni-avatar"
          className="text-md text-muted-foreground"
        >
          Avatar
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Avatar preview"
              className="h-24 w-24 object-cover border border-muted"
              loading="lazy"
            />
          ) : null}
          {previewImage ? (
            <MediaImage
              image={previewImage}
              name={inputState.name || 'Member'}
              className="h-24 w-24 object-cover border border-muted"
            />
          ) : null}

          <Input
            type="file"
            id="alumni-avatar"
            name="avatar"
            accept="image/*,.svg"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] || null
              setInputState((prev) => ({ ...prev, image: file }))
            }}
            className="rounded-none max-w-1/2 px-3 py-2.5 h-14 file:mr-3 file:border-0 file:bg-muted file:w-fit file:h-fit file:p-3 file:py-2 file:text-md file:font-medium file:text-foreground"
          />
        </div>
      </div>

      <div className="pt-5">
        <p className="text-md text-muted-foreground py-3">Roles</p>
        <div className="flex flex-wrap gap-2">
          {memberRoles.map((r, i) => (
            <Badge
              id={r}
              key={i}
              onClick={() => {
                if (roles.includes(r)) {
                  const filtered = roles.filter((mr) => mr != r)
                  setRoles([...filtered])
                } else {
                  setRoles((prev) => [...prev, r])
                }
              }}
              className={`rounded-none cursor-pointer select-none text-white ${roles.includes(r) ? 'bg-purple-800' : 'bg-stone-800'}`}
            >
              {r}
            </Badge>
          ))}
        </div>
      </div>

      <div className="pt-5 pb-10">
        <p className="text-md text-muted-foreground py-3">Socials</p>
        <div className="grid grid-cols-2 gap-3">
          {alumniSocialPlatforms.options.map((s, i) => (
            <div key={i} className="grid gap-1">
              <label
                htmlFor={s}
                className="text-xs text-muted-foreground capitalize"
              >
                {s}
              </label>
              {s === 'email' ? (
                <Input
                  name={s}
                  value={
                    inputState.socials.find((item) => item.platform === s)
                      ?.url || ''
                  }
                  onChange={(e) => {
                    const url = e.currentTarget.value
                    setInputState((prev) => {
                      const nextSocials = [...prev.socials]
                      const index = nextSocials.findIndex(
                        (item) => item.platform === s,
                      )

                      if (index >= 0) {
                        nextSocials[index] = { ...nextSocials[index], url }
                      } else {
                        nextSocials.push({ platform: s, url })
                      }

                      return { ...prev, socials: nextSocials }
                    })
                  }}
                  id={s}
                  type="email"
                  autoComplete="email"
                  placeholder={`${s}`}
                  className="placeholder:capitalize rounded-none px-3 py-5"
                />
              ) : (
                <Input
                  name={s}
                  value={
                    inputState.socials.find((item) => item.platform === s)
                      ?.url || ''
                  }
                  onChange={(e) => {
                    const url = e.currentTarget.value
                    setInputState((prev) => {
                      const nextSocials = [...prev.socials]
                      const index = nextSocials.findIndex(
                        (item) => item.platform === s,
                      )

                      if (index >= 0) {
                        nextSocials[index] = { ...nextSocials[index], url }
                      } else {
                        nextSocials.push({ platform: s, url })
                      }

                      return { ...prev, socials: nextSocials }
                    })
                  }}
                  id={s}
                  type="url"
                  autoComplete="url"
                  placeholder={`${s} URL`}
                  className="placeholder:capitalize rounded-none px-3 py-5"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-12 flex items-center justify-center gap-3">
        <Button
          disabled={isPending}
          type="reset"
          onClick={() => {
            handleReset()
          }}
          variant={'outline'}
          className="rounded-none cursor-pointer w-1/2"
        >
          Reset
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          className="rounded-none w-1/2"
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
