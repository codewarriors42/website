import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { faqSchema } from '#/types/schemas/faq.schema'
import type { FAQSchema } from '#/types/schemas/faq.schema'

type ContactFormProps = {
  formMode?: 'edit' | 'add'
  initialData?: FAQSchema
  onSubmit: (data: FAQSchema) => Promise<void>
  isPending?: boolean
}

export function FAQForm({
  formMode = 'add',
  initialData,
  onSubmit,
  isPending,
}: ContactFormProps) {
  const pending = isPending ?? false
  const isEditMode = formMode === 'edit'
  const form = useForm({
    defaultValues: {
      question: isEditMode ? (initialData?.question ?? '') : '',
      answer: isEditMode ? (initialData?.answer ?? '') : '',
    },
    validators: {
      onSubmit: faqSchema,
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
          name="question"
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
                  Question
                </label>
                <Input
                  className="p-5"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Question"
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
          name="answer"
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
                  Answer
                </label>
                <Input
                  className="p-5"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Answer"
                  type="text"
                  autoComplete="answer"
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
