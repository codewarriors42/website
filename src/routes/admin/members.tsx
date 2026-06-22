import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
// import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSidebar } from '#/components/ui/sidebar'





export const Route = createFileRoute('/admin/members')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar();
  const trpc = useTRPC()
  const { data: results } = useSuspenseQuery(
    trpc.member.getAll.queryOptions(),
  )
  return (
    <div className={`overflow-x-auto w-full grid gap-3  p-3 ${open ? "sm:grid-cols-3" : "sm:grid-cols-4"}`}>
      <Suspense fallback={<div>Lodain...</div>}>
        {results.map((m, i) => (
          <div key={i}>
            <Card className="relative mx-auto w-full max-w-sm pt-0">
              <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
              <img
                src="https://avatar.vercel.sh/shadcn1"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">{m.grade}th</Badge>
                </CardAction>
                <CardTitle>{m.name}</CardTitle>
                <CardDescription>
                  {m.roles.map(r => (
                    <p>{r}</p>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardFooter className='gap-2'>
                <Button className="w-1/2 bg-yellow-500">Edit</Button>
                <Button variant={"destructive"} className="w-1/2">Remove</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </Suspense>
    </div>
  )
}


