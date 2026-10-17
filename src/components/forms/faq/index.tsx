import { useForm } from "@tanstack/react-form";
import { useState, type ReactNode } from "react";
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

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="text-[1rem] font-semibold text-muted-foreground">
			{children}
		</p>
	);
}

export function FaqForm({ onSubmit, initialValues }: FaqFormProps) {
	const [submitAttempted, setSubmitAttempted] = useState(false);

	// Errors show once a field was touched, or after the first submit attempt
	const isInvalid = (meta: { isTouched: boolean; isValid: boolean }) =>
		(meta.isTouched || submitAttempted) && !meta.isValid;

	const defaultValues: FaqType = initialValues ?? { question: "", answer: "" };

	const form = useForm({
		defaultValues,
		validators: { onChange: faqTypeSchema },
		onSubmit: async ({ value }) => {
			try {
				await onSubmit(value);
			} catch (error) {
				console.error("Error submitting form:", error);
			}
		},
	});

	return (
		<form
			noValidate
			className="w-full h-full flex flex-col justify-between overflow-hidden"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setSubmitAttempted(true);
				void form.handleSubmit();
			}}
		>
			<div className="md:max-w-xl md:px-3 py-5 overflow-y-auto mask-b-from-95% p-5">
				<FieldGroup className="w-full">
					<form.Field name="question">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>
										<Eyebrow>Question</Eyebrow>
									</FieldLabel>
									<InputGroup className="max-w-sm p-1 border-2 border-border bg-background">
										<InputGroupTextarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={invalid}
											placeholder="Enter your question"
											rows={6}
											className="max-h-20"
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
										<FieldDescription className="text-xs px-2">
											Type the question
										</FieldDescription>
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
									<FieldLabel htmlFor={field.name}>
										<Eyebrow>Answer</Eyebrow>
									</FieldLabel>
									<InputGroup className="p-2 border-2 border-border bg-background">
										<InputGroupTextarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={invalid}
											placeholder="Enter your answer"
											rows={6}
											className="max-h-68 min-h-68 md:max-h-36 md:min-h-36"
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
										<FieldDescription className="text-xs px-2">
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
			<form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting]}>
				{([isDirty, isSubmitting]) => (
					<footer className="flex items-center gap-2 md:max-w-sm p-5">
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
										: "Create FAQ"}
						</Button>
					</footer>
				)}
			</form.Subscribe>
		</form>
	);
}
