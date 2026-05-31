import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { eventSchema } from '#/types/schemas/event.schema'
import type { Event } from '#/types/schemas/event.schema'

type ContactFormProps = {
  formMode?: 'edit' | 'add'
  initialData?: Event
  onSubmit: (data: Event) => Promise<void>
  isPending?: boolean
}

export function EventForm({
  formMode = 'add',
  initialData,
  onSubmit,
  isPending,
}: ContactFormProps) {
  const pending = isPending ?? false
  const isEditMode = formMode === 'edit'
  const form = useForm({
    defaultValues: {
      name: isEditMode ? (initialData?.name ?? '') : '',
    },
    validators: {
      onSubmit: eventSchema,
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
      <FieldGroup className="mx-auto w-full max-w-xl">
        <form.Field
          name="name"
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
                  Name
                </label>
                <Input
                  className="placeholder:capitalize rounded-none px-3 py-5 w-full"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Event name"
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
        <div className="mt-6 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto w-full max-w-lg">
          <Button
            disabled={pending}
            className="rounded-none w-full sm:w-1/2 h-10 py-2 text-sm"
          >
            {isEditMode ? 'Save' : 'Create'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
