import { useEffect, useState } from 'react'
import { Plus, Link2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ALIMUNI_SOCIAL_PLATFORMS } from '#/server/db/schemas/alumnis/alumnis-type'
import type { AlumniSocial } from '#/server/db/schemas/alumnis/alumnis-type'

type SocialProps = {
  socials: AlumniSocial[]
  onChange: (obj: AlumniSocial) => void
}

export function AddSocialsUI({ onChange, socials }: SocialProps) {
  const availablePlatforms = ALIMUNI_SOCIAL_PLATFORMS.filter(
    (platform) => !socials.some((social) => social.platform === platform),
  )

  const [open, setOpen] = useState(false)

  const [obj, setObj] = useState<AlumniSocial>({
    platform: availablePlatforms[0] ?? 'github',
    url: '',
  })

  useEffect(() => {
    if (availablePlatforms.length > 0) {
      setObj((prev) => ({
        ...prev,
        platform: availablePlatforms[0],
      }))
    }
  }, [socials])

  const handleSubmit = () => {
    if (!obj.url.trim()) return

    onChange(obj)

    setObj({
      platform: availablePlatforms[0] ?? 'github',
      url: '',
    })

    setOpen(false)
  }

  const disabled = availablePlatforms.length === 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Social
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Social Link</DialogTitle>
          <DialogDescription>
            Add a social profile for this member.
          </DialogDescription>
        </DialogHeader>

        <div className="gap-4 flex px-2 py-1">
          <div className="space-y-2 w-fit shrink-0">
            <Label className="text-xs font-medium">Platform</Label>

            <Select
              value={obj.platform}
              onValueChange={(value) =>
                setObj({
                  ...obj,
                  platform: value as AlumniSocial['platform'],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <Label className="text-xs">Profile URL</Label>

            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                type="url"
                className="pl-9"
                placeholder="https://github.com/john-doe"
                value={obj.url}
                onChange={(e) =>
                  setObj({
                    ...obj,
                    url: e.currentTarget.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={!obj.url.trim()}>
            Add Social
          </Button>
        </DialogFooter>
      </DialogContent>{' '}
    </Dialog>
  )
}
