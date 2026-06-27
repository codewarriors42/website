import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { Pencil } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { DeleteContactInfo } from './del-contact-info'
import type { ContactInfoTypeWithId } from '#/server/db/schemas/contact-info/contact-type'

export function ContactCard({ c }: { c: ContactInfoTypeWithId }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0 hover:border-border/70 transition-colors">
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Post */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Post
          </span>
          <p className="text-[13px] font-medium text-foreground leading-tight">
            {c.post}
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Email
          </span>
          <a
            href={`mailto:${c.mail}`}
            className="text-[13px] text-primary hover:underline underline-offset-2 transition-colors leading-tight truncate"
            title={c.mail}
          >
            {c.mail}
          </a>
        </div>
      </CardContent>

      <CardFooter className="flex gap-1.5 p-2.5 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
          asChild
        >
          <Link to="/admin/contact-info/$id" params={{ id: c._id }}>
            <Pencil size={11} className="mr-1" /> Edit
          </Link>
        </Button>
        <DeleteContactInfo contactInfoId={c._id} />
      </CardFooter>
    </Card>
  )
}
