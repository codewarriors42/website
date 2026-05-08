import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createFileRoute } from '@tanstack/react-router'
import type { TRPCContext } from '#/integrations/trpc/init'
import { trpcRouter } from '#/integrations/trpc/routes'
import { parseCookie } from 'cookie'
import { env } from '#/env'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '#/types/auth/jwt'
import { connectDB } from '#/server/db'

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: '/api/trpc',
    createContext: async ({ req, resHeaders }): Promise<TRPCContext> => {
      const cookieHeader = req.headers.get('cookie') || ''
      const cookie = parseCookie(cookieHeader)
      const token = cookie[env.COOKIE_NAME]

      let session: JwtPayload | null = null
      if (token) {
        try {
          session = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload
        } catch (err) {
          console.error('Error verifying JWT:', err)
          session = null
        }
      }
      const connection = await connectDB()

      if (!connection.connection.db) {
        throw new Error('MongoDB connection is not ready')
      }

      return {
        req,
        resHeaders,
        session,
        db: connection.connection,
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
