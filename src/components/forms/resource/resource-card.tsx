import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { Pencil } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getMediaUrl } from '#/lib/file-uploads'
import type { ResourceTypeWithId } from '#/server/db/schemas/resource/resource-type'
import { DeleteResource } from './del-resource'

export function ResourceCard({ e }: { e: ResourceTypeWithId }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0 hover:border-border/70 transition-colors">
      {/* Diagonal split preview */}
      <div className="relative aspect-video overflow-hidden">
        {/* Dark half */}
        <div
          className="absolute inset-0 bg-black"
          style={{ clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0 100%)' }}
        >
          {e.dark ? (
            <img
              src={getMediaUrl(e.dark) ?? ''}
              alt={`${e.dark} dark`}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ti ti-photo text-2xl text-muted" />
            </div>
          )}
        </div>

        {/* Light half */}
        <div
          className="absolute inset-0 bg-muted"
          style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)' }}
        >
          {e.light ? (
            <img
              src={getMediaUrl(e.light) ?? ''}
              alt={`${e.event} light`}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ti ti-photo text-2xl text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Badges */}
        <span className="absolute top-2 left-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-black/70 border border-border text-muted-foreground backdrop-blur-sm">
          dark
        </span>
        <span className="absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-black/70 border border-border text-muted-foreground backdrop-blur-sm">
          light
        </span>
      </div>

      {/* Info + actions */}
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex flex-col min-w-0 flex-1">
          <p
            className="text-[13px] font-medium text-foreground truncate"
            title={e.event}
          >
            {e.event}
          </p>
          <a
            href={e.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors truncate"
            title={e.link}
          >
            {e.link.replace(/^https?:\/\//, '')}
          </a>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2.5"
            asChild
          >
            <Link to="/admin/resources/$id" params={{ id: e.id }}>
              <Pencil size={11} className="mr-1" /> Edit
            </Link>
          </Button>
          <DeleteResource
            resourceId={e.id}
            darkImageId={e.dark}
            lightImageId={e.light}
          />
        </div>
      </div>
    </Card>
  )
}
