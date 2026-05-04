import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createFileRoute } from '@tanstack/react-router'
import type { TRPCContext } from '#/integrations/trpc/init'
import { trpcRouter } from '#/integrations/trpc/routes'
import { parseCookie } from 'cookie'
import { env } from '#/env'
import jwt from 'jsonwebtoken'
import type { jwt_payload } from '#/types/jwt'

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: '/api/trpc',
    createContext: ({ req, resHeaders }): TRPCContext => {
      const cookieHeader = req.headers.get('cookie') || ''
      const cookie = parseCookie(cookieHeader)
      const token = cookie[env.COOKIE_NAME]

      let session: jwt_payload | null = null
      if (token) {
        try {
          session = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as jwt_payload
        } catch (err) {
          console.error('Error verifying JWT:', err)
          session = null
        }
      }
      return {
        req,
        resHeaders,
        session,
      }
    },
  })
}

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})
