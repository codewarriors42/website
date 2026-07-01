import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Trash2 } from 'lucide-react'

type SocialLinksDisplayProps<T> = {
  socials: T[]
  onRemove: (social: T) => void
  emptyMessage?: string
  renderPlatform?: (social: T) => string
}

export function SocialLinksDisplay<T>({
  socials,
  onRemove,
  emptyMessage = 'No social links added yet',
  renderPlatform = (social) => (social as any).platform,
}: SocialLinksDisplayProps<T>) {
  if (socials.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-3 text-center">
        <p className="text-xs text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex gap-2 border-2 p-2 border-dotted rounded-lg items-center max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border scrollbar-track-background">
      {socials.map((social) => (
        <Badge
          className="py-3 flex items-center justify-center"
          variant="outline"
          key={renderPlatform(social)}
        >
          <span className="font-medium">{renderPlatform(social)}</span>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onRemove(social)}
          >
            <Trash2 className="h-2 w-2 text-destructive" />
          </Button>
        </Badge>
      ))}
    </div>
  )
}
