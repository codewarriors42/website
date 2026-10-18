import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	contactSchema,
	type ContactInfoSchemaType,
} from "#/server/db/schema/contact.db.type.ts";

type ContactFormProps = {
	initialValues?: ContactInfoSchemaType;
	onSubmit: (values: ContactInfoSchemaType) => void | Promise<void>;
};

export function ContactForm({ initialValues, onSubmit }: ContactFormProps) {
	const isEditing = !!initialValues;

	const [submitAttempted, setSubmitAttempted] = useState(false);

	const isInvalid = (meta: { isTouched: boolean; isValid: boolean }) =>
		(meta.isTouched || submitAttempted) && !meta.isValid;

	const form = useForm({
		defaultValues: {
			post: initialValues?.post ?? "",
			mail: initialValues?.mail ?? "",
		},
		validators: { onChange: contactSchema, onSubmit: contactSchema },
		onSubmit: async ({ value }) => {
			try {
				await onSubmit(contactSchema.parse(value));

				if (!isEditing) {
					form.reset();
					setSubmitAttempted(false);
				}
			} catch (error) {
				console.error("Error submitting contact form:", error);
			}
		},
	});

	return (
		<form
			noValidate
			className="w-full sm:p-5 md:p-7 lg:-10"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setSubmitAttempted(true);
				void form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="post">
					{(field) => {
						const invalid = isInvalid(field.state.meta);
						return (
							<Field data-invalid={invalid}>
								<FieldLabel htmlFor={field.name}>Post</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => {
										field.handleChange(e.target.value);
										setSubmitAttempted(false);
									}}
									aria-invalid={invalid}
									placeholder="e.g. President"
									autoComplete="off"
								/>
								{invalid ? (
									<FieldError errors={field.state.meta.errors.slice(0, 1)} />
								) : (
									<FieldDescription>
										The role this contact holds.
									</FieldDescription>
								)}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="mail">
					{(field) => {
						const invalid = isInvalid(field.state.meta);
						return (
							<Field data-invalid={invalid}>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									inputMode="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => {
										field.handleChange(e.target.value);
										setSubmitAttempted(false);
									}}
									aria-invalid={invalid}
									placeholder="name@example.com"
									autoComplete="off"
								/>
								{invalid ? (
									<FieldError errors={field.state.meta.errors.slice(0, 1)} />
								) : (
									<FieldDescription>
										Where people can reach them.
									</FieldDescription>
								)}
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>

			{/* Actions */}
			<form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting]}>
				{([isDirty, isSubmitting]) => (
					<footer className="flex items-center gap-2 p-5 mt-4">
						<Button
							disabled={isSubmitting}
							type="reset"
							className="flex-1"
							variant="secondary"
							onClick={() => {
								form.reset();
								setSubmitAttempted(false);
							}}
						>
							Reset
						</Button>

						<Button
							className="flex-1"
							type="submit"
							disabled={isSubmitting || !isDirty}
							variant="default"
						>
							{isSubmitting && initialValues
								? "Saving…"
								: initialValues
									? "Save Changes"
									: isSubmitting
										? "Creating…"
										: "Create"}
						</Button>
					</footer>
				)}
			</form.Subscribe>
		</form>
	);
}
