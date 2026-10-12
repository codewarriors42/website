import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
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
import {
	ALUMNI_SOCIAL_PLATFORMS,
	alumniSchema,
	alumniSocialSchema,
	type Alumni,
} from "#/server/db/schema/alumni.db.type.ts";
import { PhotoUpload, validatePhoto } from "../file-upload";
import { AddSocials } from "../add-social";
import { RolesPicker } from "../select-roles";
import { Badge } from "#/components/ui/badge.tsx";

const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from(
	{ length: CURRENT_YEAR - 1970 + 1 },
	(_, index) => CURRENT_YEAR - index,
);

function normalizePost(value: unknown): string {
	if (Array.isArray(value)) return value.filter(Boolean).join(", ");
	return typeof value === "string" ? value : "";
}

function toFormValues(initial?: Alumni): Alumni {
	if (!initial) {
		return {
			name: "",
			year: undefined as unknown as number,
			post: "",
			roles: [],
			current: "",
			socials: [],
			image: "",
		};
	}

	return {
		...initial,
		// Older alumni records stored `post` as an array. Normalize it because
		// the current schema and API expect a string.
		post: normalizePost(initial.post),
		roles: initial.roles ?? [],
		socials: (initial.socials ?? []).map((social) => ({
			...social,
			URL:
				social.platform === "email"
					? social.URL.replace(/^mailto:/i, "")
					: social.URL,
		})),
	};
}

function toAlumni(values: Alumni): Alumni {
	return {
		...values,
		socials: values.socials.map((social) => ({
			platform: social.platform,
			URL:
				social.platform === "email" && !/^mailto:/i.test(social.URL)
					? `mailto:${social.URL}`
					: social.URL,
		})),
	};
}

interface AlumniFormProps {
	initialValues?: Alumni;
	onSubmit: (values: Alumni) => void | Promise<void>;
}

export function AlumniForm({ initialValues, onSubmit }: AlumniFormProps) {
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: toFormValues(initialValues),
		validators: { onChange: alumniSchema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				await onSubmit(toAlumni(alumniSchema.parse(value)));
			} catch (error) {
				setSubmitError(
					error instanceof Error
						? error.message
						: "Something went wrong. Try again.",
				);
			}
		},
	});

	useEffect(() => {
		form.reset(toFormValues(initialValues));
		setPhotoError(null);
		setSubmitAttempted(false);
		setSubmitError(null);
	}, [form, initialValues]);

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
		<>
			<form
				id="alumni-form"
				noValidate
				className="mx-auto h-full w-full overflow-y-auto px-5"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					setSubmitAttempted(true);
					void form.handleSubmit();
				}}
			>
				<FieldGroup className="gap-4">
					<form.Subscribe
						selector={(state) =>
							[state.values.name, state.values.image] as const
						}
					>
						{([name, image]) => (
							<Field data-invalid={!!photoError} className="px-4">
								<FieldLabel>
									Profile photo{" "}
									<span className="font-normal text-muted-foreground">
										(optional)
									</span>
								</FieldLabel>
								<PhotoUpload
									file={image instanceof File ? image : null}
									savedUrl={typeof image === "string" ? image : ""}
									name={name}
									onPick={handlePick}
									onRemove={handleRemove}
								/>
								{photoError ? (
									<FieldError errors={[{ message: photoError }]} />
								) : (
									<FieldDescription className="pt-1 text-xs">
										JPG, PNG or WebP, up to 5 MB.
									</FieldDescription>
								)}
							</Field>
						)}
					</form.Subscribe>

					<div className="grid max-w-sm gap-3 px-4">
						<form.Field name="name">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											onBlur={field.handleBlur}
											placeholder="Alumni name"
											autoComplete="off"
											aria-invalid={invalid}
										/>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="year">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Graduation year
										</FieldLabel>
										<Select
											value={field.state.value ? String(field.state.value) : ""}
											onValueChange={(value) => {
												field.handleChange(Number(value));
												field.handleBlur();
											}}
										>
											<SelectTrigger id={field.name} aria-invalid={invalid}>
												<SelectValue placeholder="Select graduation year" />
											</SelectTrigger>
											<SelectContent>
												{GRADUATION_YEARS.map((year) => (
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

						<form.Field name="current">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Current position
											<span className="font-normal text-muted-foreground">
												(optional)
											</span>
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											onBlur={field.handleBlur}
											placeholder="Company or position"
											aria-invalid={invalid}
										/>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</div>

					<form.Field name="roles">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid} className="px-4">
									<FieldLabel htmlFor="alumni-roles">
										Roles
										<Badge
											variant={"secondary"}
											className="rounded-md py-0 my-1 text-[10px]"
										>
											New
										</Badge>
									</FieldLabel>
									<RolesPicker
										value={field.state.value}
										onChange={(value) => {
											field.handleChange(value);
											field.handleBlur();
										}}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="socials">
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
									<AddSocials
										allSocials={field.state.value}
										updateSocials={(value) => field.handleChange(value)}
										platforms={ALUMNI_SOCIAL_PLATFORMS}
										schema={alumniSocialSchema}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>
			</form>

			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<div className="mt-7 flex items-center gap-3 px-4">
						{submitError && (
							<p role="alert" className="text-sm text-destructive sm:mr-auto">
								{submitError}
							</p>
						)}
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onClick={() => {
								form.reset();
								setPhotoError(null);
								setSubmitError(null);
								setSubmitAttempted(false);
							}}
						>
							Reset
						</Button>
						<Button type="submit" form="alumni-form" disabled={isSubmitting}>
							{isSubmitting
								? "Saving..."
								: initialValues
									? "Update alumni"
									: "Add alumni"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</>
	);
}
