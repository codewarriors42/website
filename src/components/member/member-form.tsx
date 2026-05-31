import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  MemberGrade,
  memberRoles,
  socialPlatformSchema,
} from '#/types/schemas/member.schema'
import type {
  MemberFormValues,
  MemberRole,
} from '#/types/schemas/member.schema'
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
import { MoveMemberToAlumni } from './move-to-alumin'

interface MemberFormProps {
  initialData?: MemberFormValues
  onSubmit: (data: MemberFormValues) => void
  submitLabel?: string
  isEditForm?: boolean
  currentMemberEditingId?: string
  isPending?: boolean
}

export function MemberForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  currentMemberEditingId = '',
  isPending = false,
  isEditForm = false,
}: MemberFormProps) {
  const [roles, setRoles] = useState<MemberRole[]>(initialData?.roles || [])
  const [inputState, setInputState] = useState<MemberFormValues>(
    initialData || {
      roles: [],
      name: '',
      grade: '',
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
    setRoles(initialData?.roles || [])
    setInputState(
      initialData || {
        roles: [],
        name: '',
        grade: '',
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
  }

  return (
    <form
      className="grid gap-3 max-w-3xl w-full mx-auto px-4 sm:px-0"
      onSubmit={(e) => {
        e.preventDefault()
        const cleanedSocials = inputState.socials.filter(
          (social) => social.url.trim().length > 0,
        )
        onSubmit({ ...inputState, roles, socials: cleanedSocials })
        if (!initialData) handleReset()
        if (e.target instanceof HTMLFormElement) {
          e.target.reset()
        }
      }}
    >
      <div className="grid gap-2 pb-5">
        <label htmlFor="member-name" className="text-md text-muted-foreground">
          Name
        </label>

        <Input
          id="member-name"
          name="name"
          className="rounded-none px-3 py-5 w-full"
          placeholder="Member Name"
          autoComplete="name"
          value={inputState.name}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState({
              ...inputState,
              name: val,
            })
          }}
        />
      </div>

      <div className="grid gap-2 pb-5">
        <label htmlFor="member-grade" className="text-md text-muted-foreground">
          Class
        </label>
        <Select
          name="grade"
          value={inputState.grade}
          onValueChange={(value) =>
            setInputState((prev) => ({ ...prev, grade: value }))
          }
        >
          <SelectTrigger id="member-grade" className="w-full rounded-none">
            <SelectValue placeholder="Select the grade" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectGroup>
              <SelectLabel>Grade</SelectLabel>
              {MemberGrade.map((g, i) => (
                <SelectItem
                  className="rounded-none px-2"
                  value={`${g}`}
                  key={i}
                >
                  {g}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <label
          htmlFor="member-avatar"
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
            id="member-avatar"
            name="avatar"
            accept="image/*,.svg"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] || null
              setInputState((prev) => ({ ...prev, image: file }))
            }}
            className="rounded-none flex-1 px-3 py-2.5 h-14 file:mr-3 file:border-0 file:bg-muted file:w-fit file:h-fit file:p-3 file:py-2 file:text-md file:font-medium file:text-foreground"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialPlatformSchema.options.map((s, i) => (
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
                  className="placeholder:capitalize rounded-none px-3 py-5 w-full"
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
                  className="placeholder:capitalize rounded-none px-3 py-5 w-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto w-full max-w-lg">
        {isEditForm && (
          <MoveMemberToAlumni info={{ id: currentMemberEditingId }} />
        )}
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
