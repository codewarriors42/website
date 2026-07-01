import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ARCHIVE_CATEGORIES } from '#/server/db/schemas/archive/archive-type'
import type { ArchiveCategory } from '#/server/db/schemas/archive/archive-type'

type SelectCategoryUIProps = {
  value: ArchiveCategory
  onChange: (value: ArchiveCategory) => void
}

export function SelectCategoryUI({ value, onChange }: SelectCategoryUIProps) {
  return (
    <Select
      name="category"
      value={value.toString()}
      onValueChange={(newValue) => onChange(newValue as ArchiveCategory)}
    >
      <SelectTrigger id="alumni-year" className="w-full">
        <SelectValue placeholder="Select the category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          {ARCHIVE_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
