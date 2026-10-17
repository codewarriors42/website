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
	SelectGroup,
	SelectItem,
	SelectLabel,
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
			image: undefined as unknown as ArchiveType["image"],
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

	const form = useForm({
		defaultValues: toFormValues(initialValues),
		validators: { onChange: archiveSchema, onSubmit: archiveSchema },
		onSubmit: async ({ value }) => {
			try {
				await onSubmit({ ...value, image: "mainTest.png" });
			} catch (err) {
				console.error("Error submitting form:", err);
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
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setSubmitAttempted(true);
				void form.handleSubmit();
			}}
			className="h-full"
		>
			<div className="flex h-full justify-between flex-1 flex-col">
				<FieldGroup className="p-5 overflow-y-auto mask-b-from-95%">
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
												<SelectGroup>
													<SelectLabel>Year</SelectLabel>
													{ARCHIVE_YEARS.map((year) => (
														<SelectItem key={year} value={String(year)}>
															{year}
														</SelectItem>
													))}
												</SelectGroup>
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
												<SelectGroup>
													<SelectLabel>Category</SelectLabel>
													{ARCHIVE_CATEGORIES.map((c) => (
														<SelectItem key={c} value={String(c)}>
															{formatLabel(String(c))}
														</SelectItem>
													))}
												</SelectGroup>
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
												<SelectGroup>
													<SelectLabel>Event</SelectLabel>
													{ARCHIVE_EVENTS.map((e) => (
														<SelectItem key={e} value={String(e)}>
															{formatLabel(String(e))}
														</SelectItem>
													))}
												</SelectGroup>
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
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>
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

				{/* Actions */}
				<form.Subscribe
					selector={(state) => [state.isDirty, state.isSubmitting]}
				>
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
			</div>
		</form>
	);
}
