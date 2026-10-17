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
	GRADES,
	type Grade,
	MemberSchema,
	SOCIAL_PLATFORMS,
	type MemberType,
	SocialSchema,
} from "#/server/db/schema/member.db.type.ts";
import { PhotoUpload, validatePhoto } from "../file-upload";
import { RolesPicker } from "../select-roles";
import { AddSocial } from "../add-social";

function toFormValues(initial?: MemberType): MemberType {
	if (!initial) {
		return {
			name: "",
			grade: undefined as unknown as Grade,
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

	const form = useForm({
		defaultValues: toFormValues(initialValues),
		validators: { onChange: MemberSchema, onSubmit: MemberSchema },
		onSubmit: async ({ value }) => {
			try {
				await onSubmit(toMember({ ...value, image: "testImg.png" }));
			} catch (err) {
				console.error("Error submitting member form:", err);
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

	function handleRemove() {
		setPhotoError(null);
		form.setFieldValue("image", "");
	}

	return (
		<form
			id="member-form"
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
				<FieldGroup className="px-3 py-5 overflow-y-auto mask-b-from-95% scroll-smooth">
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
											value={
												field.state.value
													? String(`Grade ${field.state.value}`)
													: ""
											}
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
												<SelectGroup>
													<SelectLabel>Grade</SelectLabel>
													{GRADES.map((g) => (
														<SelectItem key={g} value={String(g)}>
															Grade {g}
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
									<AddSocial
										allSocials={field.state.value}
										updateSocials={(v) => field.handleChange(v)}
										validationSchema={SocialSchema}
										platforms={SOCIAL_PLATFORMS}
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
											: "Create Member"}
							</Button>
						</footer>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
