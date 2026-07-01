import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { getMediaUrl } from '#/lib/file-uploads'
import type { ArchiveTypeWithId } from '#/server/db/schemas/archive/archive-type'
import { Link } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { DeleteArchive } from './del-archive'

const CONTRIBUTOR_LIMIT = 4

export function ArchiveCard({ a }: { a: ArchiveTypeWithId }) {
  const visibleContributors = a.contributors.slice(0, CONTRIBUTOR_LIMIT)
  const overflow = a.contributors.length - CONTRIBUTOR_LIMIT

  return (
    <Card className="flex flex-col overflow-hidden p-0 hover:border-border/70 transition-colors">
      {/* Banner image */}
      <div className="relative w-full aspect-video bg-muted overflow-hidden">
        {a.image ? (
          <img
            src={getMediaUrl(a.image) ?? ''}
            alt={a.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="ti ti-photo text-2xl text-muted-foreground/20" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
          <Badge
            variant="secondary"
            className="text-[9px] font-medium bg-black/70 text-muted-foreground border-border backdrop-blur-sm hover:bg-black/70"
          >
            {a.category.replace(/_/g, ' ')}
          </Badge>
          <Badge
            variant="secondary"
            className="text-[9px] font-medium bg-black/70 text-muted-foreground border-border backdrop-blur-sm hover:bg-black/70"
          >
            {a.year}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <CardContent className="flex flex-col gap-2 p-3 flex-1">
        {/* Title + competition */}
        <div className="min-w-0">
          <p
            className="text-[13px] font-medium text-foreground truncate"
            title={a.title}
          >
            {a.title}
          </p>
          <p
            className="text-[11px] text-muted-foreground truncate mt-0.5"
            title={a.competition}
          >
            {a.competition}
          </p>
        </div>

        {/* Contributors + socials */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          {/* Contributor avatars */}
          <div className="flex items-center">
            {visibleContributors.map((c, i) => (
              <div
                key={i}
                title={c}
                className="w-5 h-5 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[8px] font-medium text-muted-foreground -ml-1.5 first:ml-0"
              >
                {c.charAt(0).toUpperCase()}
              </div>
            ))}
            {overflow > 0 && (
              <span className="text-[10px] text-muted-foreground ml-1.5">
                +{overflow}
              </span>
            )}
          </div>

          {/* Social links */}
          {a.links.length > 0 && (
            <div className="flex items-center gap-2">
              {a.links.map((l) => (
                <a
                  key={l.platform}
                  href={l.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors leading-none"
                  aria-label={l.platform}
                >
                  {l.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex gap-1.5 p-2.5 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
          asChild
        >
          <Link to="/admin/archives/$id" params={{ id: a.id }}>
            <Pencil size={11} className="mr-1" /> Edit
          </Link>
        </Button>
        <DeleteArchive archiveId={a.id} imageId={a.image} />
      </CardFooter>
    </Card>
  )
}
