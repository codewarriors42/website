import { useEffect, useState } from 'react'
import { Plus, Link2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

import { ALIMUNI_SOCIAL_PLATFORMS } from '#/server/db/schemas/alumni/alumnis-type'
import type { AlumniSocial } from '#/server/db/schemas/alumni/alumnis-type'

type AddSocialDialogProps = {
  socials: AlumniSocial[]
  onChange: (social: AlumniSocial) => void
}

export function AddSocialsUI({ onChange, socials }: AddSocialDialogProps) {
  const availablePlatforms = ALIMUNI_SOCIAL_PLATFORMS.filter(
    (platform) => !socials.some((social) => social.platform === platform),
  )

  const [newSocial, setNewSocial] = useState<AlumniSocial>({
    platform: availablePlatforms[0] ?? 'github',
    URL: '',
  })

  useEffect(() => {
    if (availablePlatforms.length > 0) {
      setNewSocial((prev) => ({
        ...prev,
        platform: availablePlatforms[0],
      }))
    }
  }, [socials])

  const handleSubmit = () => {
    if (!newSocial.URL.trim()) return

    onChange(newSocial)

    setNewSocial({
      platform: availablePlatforms[0] ?? 'github',
      URL: '',
    })
  }

  const disabled = availablePlatforms.length === 0

  return (
    <Dialog>
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
              value={newSocial.platform}
              onValueChange={(value) =>
                setNewSocial({
                  ...newSocial,
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
                placeholder="https://example.com"
                value={newSocial.URL}
                onChange={(e) =>
                  setNewSocial({
                    ...newSocial,
                    URL: e.currentTarget.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleSubmit} disabled={!newSocial.URL.trim()}>
            Add Social
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
