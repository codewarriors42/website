import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

type SelectYearUIProps = {
  value: number
  onChange: (value: number) => void
}

export function SelectYearUI({ value, onChange }: SelectYearUIProps) {
  return (
    <Select
      name="year"
      value={value.toString()}
      onValueChange={(newValue) => onChange(parseInt(newValue, 10))}
    >
      <SelectTrigger id="alumni-year" className="w-full">
        <SelectValue placeholder="Select the year" />
      </SelectTrigger>
      <SelectContent>
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
  )
}
