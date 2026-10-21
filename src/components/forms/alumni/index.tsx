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
	SelectGroup,
	SelectItem,
	SelectLabel,
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
import { AddSocial } from "../add-social";
import { RolesPicker } from "../select-roles";
import { Badge } from "#/components/ui/badge.tsx";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "#/components/ui/input-group.tsx";
import {
	useFileDelete,
	useFileUpload,
	useImageUrl,
} from "#/hooks/use-file-url.tsx";

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
				social.platform === "envelope"
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
				social.platform === "envelope" && !/^mailto:/i.test(social.URL)
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
	const { uploadFile } = useFileUpload();
	const { deleteFile } = useFileDelete();
	const { imgUrl } = useImageUrl(initialValues?.image as string);

	const form = useForm({
		defaultValues: toFormValues(initialValues),
		validators: { onChange: alumniSchema, onSubmit: alumniSchema },
		onSubmit: async ({ value }) => {
			try {
				if (value.image instanceof File) {
					const imageUrl = await uploadFile(value.image);
					if (!imageUrl) {
						setPhotoError("Failed to upload image. Please try again.");
						return;
					}
					if (initialValues?.image && typeof initialValues.image === "string") {
						await deleteFile(initialValues.image);
					}
					await onSubmit(toAlumni({ ...value, image: imageUrl }));
				} else {
					await onSubmit(toAlumni(value));
				}
			} catch (error) {
				console.error("Error submitting alumni form:", error);
			}
		},
	});

	useEffect(() => {
		form.reset(toFormValues(initialValues));
		setPhotoError(null);
		setSubmitAttempted(false);
	}, [form, initialValues]);

	const isInvalid = (meta: { isTouched: boolean; isValid: boolean }) =>
		(meta.isTouched || submitAttempted) && !meta.isValid;

	function handlePick(file: File) {
		const error = validatePhoto(file);
		setPhotoError(error);
		if (!error) form.setFieldValue("image", file);
	}

	return (
		<form
			id="alumni-form"
			noValidate
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				setSubmitAttempted(true);
				void form.handleSubmit();
			}}
			className="h-full"
		>
			<div className="flex pl-3 h-full justify-between flex-1 flex-col">
				<FieldGroup className="px-3 py-5 overflow-y-auto mask-b-from-95% scroll-smooth">
					<form.Subscribe
						selector={(state) =>
							[state.values.name, state.values.image] as const
						}
					>
						{([name, image]) => (
							<Field data-invalid={!!photoError}>
								<FieldLabel>
									Profile photo{" "}
									<span className="font-normal text-muted-foreground">
										(optional)
									</span>
								</FieldLabel>
								<PhotoUpload
									file={image instanceof File ? image : null}
									savedUrl={image instanceof File ? "" : (imgUrl ?? "")}
									name={name}
									onPick={handlePick}
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

					<div className="grid max-w-sm gap-5">
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
												<SelectGroup>
													<SelectLabel>Graduation Year</SelectLabel>
													{GRADUATION_YEARS.map((year) => (
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

						<form.Field name="current">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Current position{" "}
										</FieldLabel>
										<InputGroup className="max-w-sm p-1 border-2 border-border bg-background">
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={invalid}
												placeholder="Enter your current position"
												rows={6}
												className="max-h-20"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="text-xs tabular-nums">
													{field.state.value?.length || 0} characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{invalid ? (
											<FieldError errors={field.state.meta.errors} />
										) : (
											<FieldDescription className="text-xs px-2">
												Enter your current position
											</FieldDescription>
										)}
									</Field>
								);
							}}
						</form.Field>
					</div>

					<form.Field name="roles">
						{(field) => {
							const invalid = isInvalid(field.state.meta);
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor="alumni-roles">
										Roles
										<Badge
											variant={"secondary"}
											className="rounded-md h-5 my-1 text-xs"
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
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name} className="py-1">
										Social links{" "}
										<span className="font-normal text-muted-foreground">
											(optional)
										</span>
									</FieldLabel>
									<AddSocial
										allSocials={field.state.value}
										updateSocials={(v) => field.handleChange(v)}
										validationSchema={alumniSocialSchema}
										platforms={ALUMNI_SOCIAL_PLATFORMS}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>

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
											: "Create Alumni"}
							</Button>
						</footer>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
