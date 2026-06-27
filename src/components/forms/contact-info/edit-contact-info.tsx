import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast, SuccessToast } from '#/components/toast'
import { contactSchema } from '#/server/db/schemas/contact-info/contact-type'
import type {
  ContactInfoSchemaType,
  ContactInfoTypeWithId,
} from '#/server/db/schemas/contact-info/contact-type'

export function EditContactInfoUI({
  contactInfo,
}: {
  contactInfo: ContactInfoTypeWithId
}) {
  const trpc = useTRPC()
  const { mutateAsync, isPending } = useMutation(
    trpc.contact.update.mutationOptions({
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
      post: contactInfo.post,
      mail: contactInfo.mail,
    },
    validators: {
      onSubmit: contactSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({ ...value, id: contactInfo._id })
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
            name="post"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Post</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter your post"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="mail"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                  />
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
            {isPending ? 'Loading...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}
