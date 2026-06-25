import { GRADES } from '@/server/db/schemas/member/member-type'
import type { Grade } from '@/server/db/schemas/member/member-type'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectGradeProps = {
  value: Grade
  onChange: (value: Grade) => void
}

export function SelectGradeUI({ onChange, value }: SelectGradeProps) {
  return (
    <div className="w-full flex flex-col justify-center gap-2">
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val) as Grade)}
      >
        <SelectTrigger className="w-[180px]" id="m-grade">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {GRADES.map((g) => (
              <SelectItem value={g.toString()}>{g}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
