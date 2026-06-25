import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ROLES } from '@/server/db/schemas/member/member-type'
import type { Role } from '@/server/db/schemas/member/member-type'

type RolesPickerProps = {
  value: Role[]
  onChange: (value: Role[]) => void
}

export function RolesPicker({ value, onChange }: RolesPickerProps) {
  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="w-full cursor-pointer"
            size={'default'}
            id="m-roles"
            variant={'outline'}
          >
            Roles {value.length}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full">
          <PopoverHeader className="border-b py-2">
            <PopoverTitle>Roles</PopoverTitle>
            <PopoverDescription>Click to select roles</PopoverDescription>
          </PopoverHeader>

          <ToggleGroup
            type="multiple"
            value={value}
            onValueChange={(v) => onChange(v as Role[])}
            className="w-full grid max-h-50 overflow-y-auto p-3"
          >
            {ROLES.map((r) => (
              <ToggleGroupItem key={r} value={r}>
                {r}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </PopoverContent>
      </Popover>
    </div>
  )
}
