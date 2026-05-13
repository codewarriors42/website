import { contactSchema } from '#/types/schemas/contact.schema'
import type { ContactSchema } from '#/types/schemas/contact.schema'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type ContactFormProps = {
  formMode?: 'edit' | 'add'
  initialData?: ContactSchema
  onSubmit: (data: ContactSchema) => Promise<void>
  isPending?: boolean
}

export function ContactForm({
  formMode = 'add',
  initialData,
  onSubmit,
  isPending,
}: ContactFormProps) {
  const pending = isPending ?? false
  const isEditMode = formMode === 'edit'
  const form = useForm({
    defaultValues: {
      post: isEditMode ? (initialData?.post ?? '') : '',
      mail: isEditMode ? (initialData?.mail ?? '') : '',
    },
    validators: {
      onSubmit: contactSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="post"
          children={(field) => {
            const isInvalid =
              (field.state.meta.isTouched ||
                form.state.submissionAttempts > 0) &&
              !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <label
                  htmlFor={field.name}
                  className="text-sm text-muted-foreground"
                >
                  Post
                </label>
                <Input
                  className="p-5"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Post"
                  type="text"
                  autoComplete="organization-title"
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
          name="mail"
          children={(field) => {
            const isInvalid =
              (field.state.meta.isTouched ||
                form.state.submissionAttempts > 0) &&
              !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <label
                  htmlFor={field.name}
                  className="text-sm text-muted-foreground"
                >
                  Mail
                </label>
                <Input
                  className="p-5"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Mail"
                  type="email"
                  autoComplete="email"
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
        <Button disabled={pending}>{isEditMode ? 'Save' : 'Create'}</Button>
      </FieldGroup>
    </form>
  )
}
