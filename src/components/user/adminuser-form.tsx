import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type Mode = 'create_admin_user' | 'edit_admin_user' | 'admin_login'

const createSchema = (mode: Mode) =>
  z
    .object({
      username: z
        .string()
        .min(1, 'Username is required.')
        .max(50, 'Username is too long.'),
      password: z.string().optional(),
      isSuperme: z.boolean(),
      name: z.string().optional(),
      id: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (mode !== 'edit_admin_user') {
        if (!data.password || data.password.length < 1) {
          ctx.addIssue({
            code: 'custom',
            message: 'Password is required.',
            path: ['password'],
          })
        }
        if (data.password && data.password.length > 50) {
          ctx.addIssue({
            code: 'custom',
            message: 'Password is too long.',
            path: ['password'],
          })
        }
      }

      if (mode === 'create_admin_user' || mode === 'edit_admin_user') {
        if (!data.name || data.name.length < 1) {
          ctx.addIssue({
            code: 'custom',
            message: 'Name is required.',
            path: ['name'],
          })
        }
        if (data.name && data.name.length > 50) {
          ctx.addIssue({
            code: 'custom',
            message: 'Name len is too long.',
            path: ['name'],
          })
        }
      }
    })

export type FormSchema = z.infer<ReturnType<typeof createSchema>>

interface AuthFromProps {
  mode: Mode
  initaldata?: FormSchema
  isLoading?: boolean
  handler: (data: FormSchema) => Promise<void>
}

export function AuthForm({
  handler,
  mode,
  initaldata,
  isLoading,
}: AuthFromProps) {
  const schema = createSchema(mode)

  const form = useForm({
    defaultValues: {
      username: initaldata?.username ?? '',
      password: initaldata?.password ?? '',
      isSuperme: initaldata?.isSuperme ?? true,
      name:
        mode === 'edit_admin_user' || mode === 'create_admin_user'
          ? (initaldata?.name ?? '')
          : '',
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await handler(value)
    },
  })

  return (
    <div>
      <form
        id={mode}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          {mode !== 'admin_login' && (
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
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
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          )}

          <form.Field
            name="username"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="text-sm">
                    Username
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Username"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="text-sm">
                    {mode === 'edit_admin_user'
                      ? 'Change Password'
                      : 'Password'}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={
                      mode === 'edit_admin_user'
                        ? 'Change Password'
                        : 'Password'
                    }
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>

        <div className="w-full grid grid-cols-2 gap-3 mt-7">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form={mode}>
            {isLoading
              ? 'Loading...'
              : mode === 'edit_admin_user'
                ? 'Save'
                : mode === 'create_admin_user'
                  ? 'Submit'
                  : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  )
}
