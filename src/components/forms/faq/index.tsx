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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "#/components/ui/input-group";
import { type FaqType, faqTypeSchema } from "#/server/db/schema/faq.db.type.ts";

interface FaqFormProps {
	initialValues?: FaqType;
	onSubmit: (values: FaqType) => void | Promise<void>;
}

export function FaqForm({ onSubmit, initialValues }: FaqFormProps) {
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Errors show once a field was touched, or after the first submit attempt
	const isInvalid = (meta: { isTouched: boolean; isValid: boolean }) =>
		(meta.isTouched || submitAttempted) && !meta.isValid;

	const defaultValues: FaqType = initialValues ?? { question: "", answer: "" };

	const form = useForm({
		defaultValues,
		validators: { onChange: faqTypeSchema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				await onSubmit(value);
			} catch (error) {
				setSubmitError(
					error instanceof Error
						? error.message
						: "Something went wrong. Please try again.",
				);
			}
		},
	});

	return (
		<form
			noValidate
			className="flex h-full min-h-0 w-full flex-col"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setSubmitAttempted(true);
				void form.handleSubmit();
			}}
		>
			{/* Fields (scrolls if the screen is short, e.g. with the phone keyboard open) */}
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
				<FieldGroup className="w-full max-w-2xl">
					<form.Field name="question">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Question</FieldLabel>
									<InputGroup className="max-w-sm">
										<InputGroupTextarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={invalid}
											placeholder="Enter your question"
											rows={6}
											className="px-4 py-3 min-h-20 max-h-24 sm:min-h-24 sm:max-h-32"
										/>
										<InputGroupAddon align="block-end">
											<InputGroupText className="text-xs tabular-nums">
												{field.state.value.length} characters
											</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									{invalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : (
										<FieldDescription>Type the question.</FieldDescription>
									)}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="answer">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Answer</FieldLabel>
									<InputGroup className="max-w-sm">
										<InputGroupTextarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={invalid}
											placeholder="Enter your answer"
											rows={6}
											className="px-4 py-3 min-h-32 max-h-40 sm:min-h-32"
										/>
										<InputGroupAddon align="block-end">
											<InputGroupText className="text-xs tabular-nums">
												{field.state.value.length} characters
											</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									{invalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : (
										<FieldDescription>
											Give a detailed answer to the question.
										</FieldDescription>
									)}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>
			</div>

			{/* Actions */}
			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<div className="flex shrink-0 flex-wrap gap-3 px-4 py-4 items-center sm:px-7">
						{submitError && (
							<p
								role="alert"
								className="w-full text-sm text-destructive sm:mr-auto sm:w-auto"
							>
								{submitError}
							</p>
						)}
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							className="flex-1 sm:flex-none"
							onClick={() => {
								form.reset();
								setSubmitError(null);
								setSubmitAttempted(false);
							}}
						>
							Reset
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 sm:flex-none"
						>
							{isSubmitting
								? "Saving…"
								: initialValues
									? "Update FAQ"
									: "Add FAQ"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
