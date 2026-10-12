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
	GRADES,
	type Grade,
	MemberSchema,
	type MemberType,
} from "#/server/db/schema/member.db.type.ts";
import {
	SOCIAL_PLATFORMS,
	SocialSchema,
} from "#/server/db/schema/member.db.type.ts";
import { PhotoUpload, validatePhoto } from "../file-upload";
import { RolesPicker } from "../select-roles";
import { AddSocials } from "../add-social";

/** Saved members store "mailto:x@y.com"; show just the address while editing. */
function toFormValues(initial?: MemberType): MemberType {
	if (!initial) {
		return {
			name: "",
			grade: undefined as unknown as Grade, // nothing selected, so "required" works
			roles: [],
			socials: [],
			image: "",
		};
	}
	return {
		...initial,
		roles: initial.roles ?? [],
		socials: (initial.socials ?? []).map((s) => ({
			...s,
			URL: s.platform === "email" ? s.URL.replace(/^mailto:/i, "") : s.URL,
		})),
	};
}

/** Clean the validated values before sending them to the API. */
function toMember(values: MemberType): MemberType {
	return {
		...values,
		socials: values.socials.map((s) => ({
			platform: s.platform,
			URL:
				s.platform === "email" && !/^mailto:/i.test(s.URL)
					? `mailto:${s.URL}`
					: s.URL,
		})),
	};
}

interface MemberFormProps {
	initialValues?: MemberType;
	onSubmit: (values: MemberType) => void | Promise<void>;
}

export function MemberForm({ initialValues, onSubmit }: MemberFormProps) {
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: toFormValues(initialValues),
		validators: { onChange: MemberSchema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				// parse() applies trimming; awaiting keeps isSubmitting accurate
				await onSubmit(toMember(MemberSchema.parse(value)));
			} catch (err) {
				setSubmitError(
					err instanceof Error
						? err.message
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
				id="member-form"
				noValidate
				className="mx-auto w-full overflow-y-auto px-5"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setSubmitAttempted(true);
					void form.handleSubmit();
				}}
			>
				<FieldGroup className="gap-4">
					{/* Photo (optional) */}
					<form.Subscribe
						selector={(s) => [s.values.name, s.values.image] as const}
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
									<FieldDescription className="text-xs pt-1">
										JPG, PNG or WebP, up to 5 MB.
									</FieldDescription>
								)}
							</Field>
						)}
					</form.Subscribe>

					{/* Name + grade */}
					<div className="grid max-w-sm px-4 gap-3">
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
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Member Name"
											autoComplete="off"
											aria-invalid={invalid}
										/>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="grade">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Grade</FieldLabel>
										<Select
											value={field.state.value ? String(field.state.value) : ""}
											onValueChange={(v) => {
												field.handleChange(Number(v) as Grade);
												field.handleBlur();
											}}
										>
											<SelectTrigger
												id={field.name}
												className="max-w-fit"
												aria-invalid={invalid}
											>
												<SelectValue placeholder="Select grade" />
											</SelectTrigger>
											<SelectContent>
												{GRADES.map((g) => (
													<SelectItem key={g} value={String(g)}>
														Grade {g}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="roles">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Roles</FieldLabel>
										<RolesPicker
											value={field.state.value}
											onChange={(v) => {
												field.handleChange(v);
												field.handleBlur();
											}}
										/>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</div>

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
										updateSocials={(v) => field.handleChange(v)}
										platforms={SOCIAL_PLATFORMS}
										schema={SocialSchema}
									/>
									{invalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>
			</form>

			{/* Actions */}
			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<div className="flex mt-7 gap-3 px-4">
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
						<Button type="submit" form="member-form" disabled={isSubmitting}>
							{isSubmitting
								? "Saving…"
								: initialValues
									? "Update member"
									: "Add member"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</>
	);
}
