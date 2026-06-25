import { createFileRoute, Link } from '@tanstack/react-router'
import { useTRPC } from '@/integrations/trpc/react'
// import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { getMediaUrl } from '@/lib/file-uploads'
import { DeleteMember } from '@/components/forms/member/del-member'

export const Route = createFileRoute('/admin/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: results } = useQuery(trpc.member.getAll.queryOptions())
  return (
    <div
      className={`overflow-x-auto w-full grid gap-3  p-3 ${open ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}
    >
      <div>
        <Link to="/admin/members/add-member">Add member</Link>
      </div>
      {results?.map((m, i) => (
        <div key={i}>
          <Card className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src={getMediaUrl(m.image) ?? ''}
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">{m.grade}th</Badge>
              </CardAction>
              <CardTitle>{m.name}</CardTitle>
              <CardDescription>
                {m.roles.map((r) => (
                  <p>{r}</p>
                ))}
              </CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
              <Button className="w-1/2 bg-yellow-500" asChild>
                <Link to="/admin/members/$id" params={{ id: m._id.toString() }}>
                  Edit
                </Link>
              </Button>
              <DeleteMember memberId={m._id.toString()} imageId={m.image} />
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
