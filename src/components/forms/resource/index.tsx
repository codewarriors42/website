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
import { Input } from "#/components/ui/input.tsx";

import {
	resourceSchema,
	type ResourceType,
} from "#/server/db/schema/resource.db.type.ts";

import { PhotoUpload } from "../file-upload";

type ImageName = "dark" | "light";

interface ResourceFormProps {
	initialValues?: ResourceType;
	onSubmit: (values: ResourceType) => void | Promise<void>;
}

/**
 * Editing: render it with a key, e.g. <ResourceForm key={resource.id} initialValues={resource} />
 * so switching to another resource starts a fresh form.
 */
export function ResourceForm({ onSubmit, initialValues }: ResourceFormProps) {
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const defaultValues: ResourceType = initialValues ?? {
		name: "",
		link: "",
		// empty on purpose: the schema reports "Dark image is required" until one is added
		dark: undefined as unknown as File | string,
		light: undefined as unknown as File | string,
	};

	const form = useForm({
		defaultValues,
		// The schema checks everything, images included (required, type, size).
		// This also runs on submit, so an invalid form never reaches onSubmit.
		validators: { onChange: resourceSchema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				console.log("ResourceForm onSubmit", value);
				await onSubmit({
					...value,
					dark: "dark0image.png",
					light: "light0image.png",
				});
			} catch (error) {
				setSubmitError(
					error instanceof Error
						? error.message
						: "Something went wrong. Please try again.",
				);
			}
		},
	});

	// Errors show once a field was touched, or after the first submit attempt
	function isFieldInvalid(meta: { isTouched: boolean; isValid: boolean }) {
		return (meta.isTouched || submitAttempted) && !meta.isValid;
	}

	function handleReset() {
		form.reset();
		setSubmitAttempted(false);
		setSubmitError(null);
	}

	/** One upload for one theme: same markup for dark and light. */
	function imageField(imageName: ImageName, label: string) {
		return (
			<form.Field name={imageName}>
				{(field) => {
					const image = field.state.value;
					const invalid = isFieldInvalid(field.state.meta);

					return (
						<Field data-invalid={invalid}>
							<FieldLabel>{label}</FieldLabel>

							<form.Subscribe selector={(state) => state.values.name}>
								{(resourceName) => (
									<PhotoUpload
										file={image instanceof File ? image : null}
										savedUrl={typeof image === "string" ? image : ""}
										name={resourceName}
										// Any picked file goes into the form: the schema decides if it is valid
										onPick={(file) => {
											field.handleChange(file);
											setSubmitError(null);
										}}
										onRemove={() => field.handleChange("")}
									/>
								)}
							</form.Subscribe>

							{invalid ? (
								<FieldError errors={field.state.meta.errors.slice(0, 1)} />
							) : (
								<FieldDescription className="text-xs">
									JPG, PNG or WebP, up to {5} MB.
								</FieldDescription>
							)}
						</Field>
					);
				}}
			</form.Field>
		);
	}

	return (
		<form
			noValidate
			className="flex h-full min-h-0 w-full flex-col"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();

				setSubmitAttempted(true);
				void form.handleSubmit();
			}}
		>
			{/* Scrollable fields */}
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
				<FieldGroup className="w-full max-w-2xl gap-5">
					{/* Name */}
					<form.Field name="name">
						{(field) => {
							const invalid = isFieldInvalid(field.state.meta);

							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(event) => {
											field.handleChange(event.target.value);
											setSubmitError(null);
										}}
										onBlur={field.handleBlur}
										placeholder="Name"
										autoComplete="off"
										aria-invalid={invalid}
									/>

									{invalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : (
										<FieldDescription>
											Type the name of the resource.
										</FieldDescription>
									)}
								</Field>
							);
						}}
					</form.Field>

					{/* Link */}
					<form.Field name="link">
						{(field) => {
							const invalid = isFieldInvalid(field.state.meta);

							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Link</FieldLabel>

									<Input
										id={field.name}
										name={field.name}
										type="url"
										value={field.state.value}
										onChange={(event) => {
											field.handleChange(event.target.value);
											setSubmitError(null);
										}}
										onBlur={field.handleBlur}
										placeholder="https://"
										autoComplete="url"
										aria-invalid={invalid}
									/>

									{invalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : (
										<FieldDescription>
											Type the link to the resource.
										</FieldDescription>
									)}
								</Field>
							);
						}}
					</form.Field>

					{/* Images: side by side on wider screens, stacked on phones */}
					<div className="grid gap-5 sm:grid-cols-2">
						{imageField("dark", "Dark image")}
						{imageField("light", "Light image")}
					</div>
				</FieldGroup>
			</div>

			{/* Actions */}
			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border px-4 py-4 sm:justify-end sm:px-7">
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
							onClick={handleReset}
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
									? "Update resource"
									: "Add resource"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
