import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Separator } from '#/components/ui/separator'
import { getMediaUrl } from '#/lib/file-uploads'
import type { MemberWithId } from '#/server/db/schemas/member/member-type'
import { Link } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { DeleteMember } from './del-member'

const ROLE_DISPLAY_LIMIT = 4

const SOCIAL_ICONS: Record<string, string> = {
  twitter: 'ti-brand-x',
  linkedin: 'ti-brand-linkedin',
  github: 'ti-brand-github',
  instagram: 'ti-brand-instagram',
  discord: 'ti-brand-discord',
  email: 'ti-mail',
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
]

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export function MemberCard({ m }: { m: MemberWithId }) {
  const visibleRoles = m.roles.slice(0, ROLE_DISPLAY_LIMIT)
  const overflow = m.roles.length - ROLE_DISPLAY_LIMIT
  const initials = m.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card className="flex flex-col overflow-hidden p-0 hover:border-border/70 transition-colors">
      {/* Header — avatar + name + grade */}
      <CardContent className="p-3 pb-0 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={getMediaUrl(m.image) ?? ''} alt={m.name} />
            <AvatarFallback className={getAvatarColor(m.name)}>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p
              className="text-[13px] font-medium leading-tight truncate"
              title={m.name}
            >
              {m.name}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Grade {m.grade}
            </p>
          </div>
        </div>

        <Separator />
      </CardContent>

      {/* Body — roles + socials */}
      <CardContent className="flex flex-col gap-2 p-3 flex-1">
        {/* Roles */}
        <div className="flex flex-wrap gap-1 items-center">
          {visibleRoles.map((role) => (
            <Badge
              key={role}
              variant="secondary"
              className="text-[11px] font-normal rounded-full px-1.5 py-0.5"
            >
              {role.replace(/_/g, ' ')}
            </Badge>
          ))}
          {overflow > 0 && (
            <span
              className="text-[11px] text-muted-foreground cursor-default px-1"
              title={m.roles
                .slice(ROLE_DISPLAY_LIMIT)
                .map((r) => r.replace(/_/g, ' '))
                .join(', ')}
            >
              +{overflow}
            </span>
          )}
        </div>

        {/* Socials */}
        {m.socials.length > 0 && (
          <div className="flex gap-2.5 flex-wrap">
            {m.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors leading-none"
                aria-label={s.platform}
              >
                <i
                  className={`ti ${SOCIAL_ICONS[s.platform] ?? 'ti-link'}`}
                  style={{ fontSize: 14 }}
                />
              </a>
            ))}
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex gap-1.5 p-2.5 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
          asChild
        >
          <Link to="/admin/members/$id" params={{ id: m.id }}>
            <Pencil size={11} className="mr-1" /> Edit
          </Link>
        </Button>
        <DeleteMember memberId={m.id} imageId={m.image} />
      </CardFooter>
    </Card>
  )
}
