import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '#/components/ui/input-group'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { faqTypeSchema } from '#/server/db/schemas/faq/faq-type'
import type { FaqType } from '#/server/db/schemas/faq/faq-type'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'

export function AddFaqUI() {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.faq.create.mutationOptions({
      onSuccess: (d) => {
        SuccessToast(d.message)
      },
      onError: (e) => {
        ErrorToast(e.message)
      },
    }),
  )
  const form = useForm({
    defaultValues: {
      question: '',
      answer: '',
    },
    validators: {
      onSubmit: faqTypeSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })
  return (
    <div className="max-w-md w-full">
      <form
        id="faq_form"
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
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Question</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter your question"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="answer"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Answer</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your answer"
                      rows={3}
                      className="overflow-y-auto max-h-48 resize-none min-h-28"
                      aria-invalid={isInvalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-xs tabular-nums">
                        {field.state.value.length} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription className="pt-1">
                    Give a detailed answer to the question. You can use Markdown
                    formatting to enhance your answer.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-3 mt-5 w-full">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="faq_form">
            {isPending ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
