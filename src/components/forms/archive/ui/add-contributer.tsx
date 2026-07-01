import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ContributerUIProps = {
  onChange: (obj: string) => void
}

export function AddArchiveContributerUI({ onChange }: ContributerUIProps) {
  const [name, setName] = useState('')

  const handleAdd = () => {
    onChange(name.trim())
    setName('')
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contributer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Contributer</DialogTitle>
          <DialogDescription>
            Add a contributer for this archive.
          </DialogDescription>
        </DialogHeader>

        <div className="gap-4 flex px-2 py-1">
          <div className="space-y-2 w-full">
            <Label className="text-xs">Contributer Name</Label>
            <Input
              type="text"
              className="w-full"
              placeholder="Enter contributer name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button type="button" onClick={handleAdd}>
            Add Contributer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
