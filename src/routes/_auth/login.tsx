import { ErrorToast, SuccessToast } from '#/components/toast'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AuthForm } from '#/components/user/adminuser-form'

export const Route = createFileRoute('/_auth/login')({
  beforeLoad: async ({ context }) => {
    const { session } = await context.queryClient.fetchQuery({
      ...context.trpc.auth.getSession.queryOptions(),
    })

    if (session?.userId) {
      throw redirect({ to: '/admin' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        ErrorToast(error.message)
      },
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
    }),
  )
  const navigation = useNavigate()
  return (
    <div className="w-full min-h-svh select-none flex items-center justify-center px-4 pb-10">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <h1 className="font-logo text-5xl">CW</h1>
          <p className="text-gray-400 font-semibold text-pretty">
            Continue to the dashboard
          </p>
        </div>

        {/* Form */}
        <AuthForm
          mode="admin_login"
          handler={async (value) => {
            alert(value)
            const res = await mutateAsync({
              username: value.username,
              password: value.password,
            })
            if (res.is_success) {
              navigation({ to: '/admin' })
            }
          }}
          isLoading={isPending}
        />
      </div>
    </div>
  )
}
