import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { EditUser } from '#/components/user/edit-admin'
import { RemoveUser } from '#/components/user/del-admin'
import { AddAdmin } from '#/components/user/add-admin'

export const Route = createFileRoute('/admin/admin-users')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data: users, isLoading } = useQuery(trpc.auth.getAll.queryOptions())

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage administrator accounts
          </p>
        </div>
        <div>
          <AddAdmin />
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {users?.map((u) => (
            <div
              key={u._id.toString()}
              className="border p-4 rounded flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-lg">{u.name}</div>
                <div className="text-sm text-muted-foreground">
                  @{u.username}
                </div>
                <div className="text-sm">
                  Role: {u.isSupreme ? 'Admin' : 'User'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditUser
                  userData={{
                    id: u._id.toString(),
                    username: u.username,
                    name: u.name,
                    isSuperme: u.isSupreme,
                    password: '',
                  }}
                />
                <RemoveUser info={{ id: u._id.toString() }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
