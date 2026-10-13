import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { ARCHIVE_EVENTS } from "#/constant/archive-events.ts";
import {
	ARCHIVE_CATEGORIES,
	ARCHIVE_PLATFORMS,
	archiveSchema,
	archiveSocialPlatform,
	type ArchiveType,
} from "#/server/db/schema/archive.db.type.ts";
import { PhotoUpload, validatePhoto } from "../file-upload";
import { AddContributors } from "#/components/add-contributers.tsx";
import { AddSocial } from "../add-social";

const CURRENT_YEAR = new Date().getFullYear();
const ARCHIVE_YEARS = Array.from(
	{ length: CURRENT_YEAR - 1970 + 1 },
	(_, i) => CURRENT_YEAR - i,
);

/** "creative-prompt" -> "Creative prompt" */
const formatLabel = (value: string) => {
	const text = value.replace(/[-_]+/g, " ");
	return text.charAt(0).toUpperCase() + text.slice(1);
};

function toFormValues(initial?: ArchiveType): ArchiveType {
	if (!initial) {
		return {
			title: "",
			competition: "",
			// nothing selected yet, so "required" is actually enforced
			category: undefined as unknown as ArchiveType["category"],
			event: undefined as unknown as ArchiveType["event"],
			contributors: [],
			year: CURRENT_YEAR,
			links: [],
			image: "",
		};
	}
	return {
		...initial,
		contributors: initial.contributors ?? [],
		links: initial.links ?? [],
	};
}

interface ArchiveFormProps {
	initialValues?: ArchiveType;
	onSubmit: (values: ArchiveType) => void | Promise<void>;
}

/**
 * Editing: render it with a key, e.g. <ArchiveForm key={archive.id} initialValues={archive} />
 * so switching to another archive starts a fresh form.
 */
export function ArchiveForm({ initialValues, onSubmit }: ArchiveFormProps) {
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: toFormValues(initialValues),
		validators: { onChange: archiveSchema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				await onSubmit(archiveSchema.parse(value));
			} catch (err) {
				setSubmitError(
					err instanceof Error
						? err.message
						: "Something went wrong. Try again.",
				);
			}
		},
	});

	const isInvalid = (meta: { isTouched: boolean; isValid: boolean }) =>
		(meta.isTouched || submitAttempted) && !meta.isValid;

	function handlePick(file: File) {
		const error = validatePhoto(file);
		setPhotoError(error);
		if (!error) form.setFieldValue("image", file);
	}

	function handleRemove() {
		setPhotoError(null);
		form.setFieldValue("image", "");
	}

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
			{/* Fields: this part scrolls, the buttons below stay pinned */}
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
				<FieldGroup className="w-full max-w-2xl gap-5">
					{/* Cover image (optional) */}
					<form.Subscribe
						selector={(s) => [s.values.title, s.values.image] as const}
					>
						{([title, image]) => (
							<Field data-invalid={!!photoError}>
								<FieldLabel>
									Cover image{" "}
									<span className="font-normal text-muted-foreground">
										(optional)
									</span>
								</FieldLabel>
								<PhotoUpload
									file={image instanceof File ? image : null}
									savedUrl={typeof image === "string" ? image : ""}
									name={title}
									onPick={handlePick}
									onRemove={handleRemove}
								/>
								{photoError ? (
									<FieldError errors={[{ message: photoError }]} />
								) : (
									<FieldDescription className="text-xs">
										JPG, PNG or WebP, up to 5 MB.
									</FieldDescription>
								)}
							</Field>
						)}
					</form.Subscribe>

					{/* Title */}
					<form.Field name="title">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Title</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder="e.g. National Quiz Finals"
										autoComplete="off"
										aria-invalid={invalid}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					{/* Competition */}
					<form.Field name="competition">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Competition</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder="e.g. Inter-School Quiz League"
										autoComplete="off"
										aria-invalid={invalid}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					{/* Year / category / event: one row on wide screens, stacked on phones */}
					<div className="grid gap-5 sm:grid-cols-3">
						<form.Field name="year">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Year</FieldLabel>
										<Select
											value={field.state.value ? String(field.state.value) : ""}
											onValueChange={(value) => {
												field.handleChange(Number(value));
												field.handleBlur();
											}}
										>
											<SelectTrigger
												id={field.name}
												className="w-full"
												aria-invalid={invalid}
											>
												<SelectValue placeholder="Select year" />
											</SelectTrigger>
											<SelectContent>
												{ARCHIVE_YEARS.map((year) => (
													<SelectItem key={year} value={String(year)}>
														{year}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="category">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Category</FieldLabel>
										<Select
											value={field.state.value ? String(field.state.value) : ""}
											onValueChange={(v) => {
												field.handleChange(v as ArchiveType["category"]);
												field.handleBlur();
											}}
										>
											<SelectTrigger
												id={field.name}
												className="w-full"
												aria-invalid={invalid}
											>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{ARCHIVE_CATEGORIES.map((c) => (
													<SelectItem key={c} value={String(c)}>
														{formatLabel(String(c))}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="event">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Event</FieldLabel>
										<Select
											value={field.state.value ? String(field.state.value) : ""}
											onValueChange={(v) => {
												field.handleChange(v as ArchiveType["event"]);
												field.handleBlur();
											}}
										>
											<SelectTrigger
												id={field.name}
												className="w-full"
												aria-invalid={invalid}
											>
												<SelectValue placeholder="Select event" />
											</SelectTrigger>
											<SelectContent>
												{ARCHIVE_EVENTS.map((e) => (
													<SelectItem key={e} value={String(e)}>
														{formatLabel(String(e))}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</div>

					{/* Contributors */}
					<form.Field name="contributors">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Contributors</FieldLabel>
									<AddContributors
										contributors={field.state.value}
										setContributors={(next) => field.handleChange(next)}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					{/* Links */}
					<form.Field name="links">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid} className="px-4">
									<FieldLabel htmlFor={field.name} className="py-1">
										Social links{" "}
										<span className="font-normal text-muted-foreground">
											(optional)
										</span>
									</FieldLabel>
									<AddSocial
										allSocials={field.state.value}
										updateSocials={(v) => field.handleChange(v)}
										validationSchema={archiveSocialPlatform}
										platforms={ARCHIVE_PLATFORMS}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>
			</div>

			{/* Actions */}
			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border px-4 py-4 sm:px-7">
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
								setPhotoError(null);
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
									? "Update archive"
									: "Add archive"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
