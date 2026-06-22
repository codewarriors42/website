import { trpcClient } from '#/integrations/tanstack-query/root-provider'

export async function getSession() {
  const session = await trpcClient.auth.getSession.query()
  return session
}
