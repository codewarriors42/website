import { ErrorToast, SuccessToast } from '#/components/toast'
import { useTRPC } from '#/integrations/trpc/react'
import { addUserSchema } from '#/types/zod/auth.user'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { CircleNotchIcon } from '@phosphor-icons/react'

export const Route = createFileRoute('/_auth/add-user')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.auth.addUser.mutationOptions({
      onError: (error) => {
        ErrorToast(error.message)
      },
      onSuccess: (res) => {
        SuccessToast(res.message)
      },
    }),
  )
  const navigation = useNavigate()
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      name: '',
    },
    validators: {
      onSubmit: addUserSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await mutateAsync({ ...value })
      if (res.is_success) {
        navigation({ to: '/' })
      }
    },
  })

  return (
    <div className="w-full min-h-svh select-none flex items-center justify-center px-4 pb-10">
      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <h1 className="font-logo text-5xl">CW</h1>
          <p className="text-gray-400 font-semibold text-pretty">
            Create new admin user
          </p>
        </div>

        {/* Form */}
        <form
          id="add-user-form"
          className="w-full space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      className="p-5"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError
                        className="px-2"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      className="p-5"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Username"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError
                        className="px-2"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      className="p-5"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError
                        className="px-2"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {/* Buttons */}
          <Field orientation="responsive" className="flex mt-4">
            <Button type="submit" className="p-5">
              {isPending ? (
                <CircleNotchIcon
                  weight="bold"
                  className="animate-spin text-background"
                />
              ) : (
                'Add User'
              )}
            </Button>
          </Field>
        </form>
      </div>
    </div>
  )
}
