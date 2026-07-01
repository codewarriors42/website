import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ARCHIVE_EVENTS } from '#/constants/events'
import type { ArchiveEventType } from '#/constants/events'

type SelectCategoryUIProps = {
  value: ArchiveEventType
  onChange: (value: ArchiveEventType) => void
}

export function SelectArchiveEventUI({
  value,
  onChange,
}: SelectCategoryUIProps) {
  return (
    <Select
      name="event"
      value={value.toString()}
      onValueChange={(newValue) => onChange(newValue as ArchiveEventType)}
    >
      <SelectTrigger id="alumni-year" className="w-full">
        <SelectValue placeholder="Select the event" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Event</SelectLabel>
          {ARCHIVE_EVENTS.map((event) => (
            <SelectItem key={event} value={event}>
              {event}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
