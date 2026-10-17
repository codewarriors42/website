import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { z } from "zod";
import {
	type Social,
	SocialLinks,
	type SocialLinksTypes,
} from "../social-links";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
} from "../ui/select";

type AddSocialProps<T extends SocialLinksTypes> = {
	allSocials: Social<T>[];
	updateSocials: (socials: Social<T>[]) => void;
	platforms: readonly Social<T>["platform"][];
	validationSchema: z.ZodType<Social<T>>;
};

/** "google_drive" -> "Google Drive", "github" -> "GitHub" */
const PLATFORM_LABELS: Record<string, string> = {
	github: "GitHub",
	linkedin: "LinkedIn",
	youtube: "YouTube",
	google_drive: "Google Drive",
};
const platformLabel = (platform: string) =>
	PLATFORM_LABELS[platform] ??
	platform.replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase());

export function AddSocial<T extends SocialLinksTypes>({
	allSocials,
	updateSocials,
	validationSchema,
	platforms,
}: AddSocialProps<T>) {
	const [showForm, setShowForm] = useState(false);
	const urlRef = useRef<HTMLInputElement>(null);
	const platformId = useId();
	const urlId = useId();

	const availablePlatforms = platforms.filter(
		(platform) => !allSocials.some((social) => social.platform === platform),
	);

	const form = useForm({
		defaultValues: { platform: "" as SocialLinksTypes, URL: "" },
		validators: {
			// Turn the schema's issues into per-field errors, so each message shows under its own field
			onChange: ({ value }) => {
				const result = validationSchema.safeParse(value);
				if (result.success) return undefined;

				const fields: Record<string, { message: string }> = {};
				for (const issue of result.error.issues) {
					const key = String(issue.path[0] ?? "URL");
					fields[key] ??= { message: issue.message };
				}
				return { fields };
			},
		},
		onSubmit: ({ value }) => {
			if (allSocials.some((social) => social.platform === value.platform))
				return;

			updateSocials([...allSocials, value as Social<T>]);
			form.reset();

			// That was the last free platform: close the panel
			if (availablePlatforms.length <= 1) setShowForm(false);
		},
	});

	function close() {
		form.reset();
		setShowForm(false);
	}

	function handleDelete(platform: SocialLinksTypes) {
		updateSocials(allSocials.filter((social) => social.platform !== platform));
	}

	const isInvalid = (meta: {
		isTouched: boolean;
		isDirty: boolean;
		isValid: boolean;
	}) => meta.isTouched && meta.isDirty && !meta.isValid;

	return (
		<div className="space-y-4">
			<SocialLinks
				socials={allSocials}
				isInForm={true}
				removeSocial={handleDelete}
			/>

			{showForm && availablePlatforms.length > 0 ? (
				<fieldset
					aria-label="Add a social link"
					className="space-y-3 border bg-card p-5 rounded-lg"
				>
					<div className="flex flex-col gap-3">
						{/* Platform */}
						<form.Field name="platform">
							{(field) => {
								const invalid = isInvalid(field.state.meta);
								return (
									<Field data-invalid={invalid}>
										<Select
											value={field.state.value}
											onValueChange={(value) => {
												if (value === null) return;
												field.handleChange(value as SocialLinksTypes);
												field.handleBlur();
												urlRef.current?.focus(); // jump straight to the link field
											}}
										>
											<SelectTrigger
												id={platformId}
												className="w-full"
												aria-invalid={invalid}
											>
												{field.state.value ? (
													platformLabel(field.state.value)
												) : (
													<span className="text-muted-foreground">
														Select platform
													</span>
												)}
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Social Platforms</SelectLabel>
													{availablePlatforms.map((platform) => (
														<SelectItem key={platform} value={platform}>
															{platformLabel(platform)}
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

						{/* URL / email */}
						<form.Subscribe selector={(state) => state.values.platform}>
							{(platform) => (
								<form.Field name="URL">
									{(field) => {
										const invalid = isInvalid(field.state.meta);
										const isEmail = platform === "email";
										return (
											<Field data-invalid={invalid}>
												<Input
													id={urlId}
													ref={urlRef}
													value={field.state.value}
													onChange={(event) =>
														field.handleChange(event.target.value)
													}
													onBlur={field.handleBlur}
													onKeyDown={(event) => {
														if (event.key === "Enter") {
															event.preventDefault();
															void form.handleSubmit();
														}
													}}
													type={isEmail ? "email" : "url"}
													autoComplete="off"
													placeholder={
														isEmail ? "name@example.com" : "Enter the URL"
													}
													aria-invalid={invalid}
													className="placeholder:text-sm text-sm"
												/>
												{invalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								</form.Field>
							)}
						</form.Subscribe>
					</div>

					{/* Actions */}
					<form.Subscribe
						selector={(state) => ({
							platform: state.values.platform,
							URL: state.values.URL,
						})}
					>
						{({ platform, URL }) => (
							<div className="flex-1 flex gap-2">
								<Button
									type="button"
									size="sm"
									variant="destructive"
									onClick={close}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									type="button"
									size="sm"
									className="flex-1"
									onClick={() => void form.handleSubmit()}
									disabled={!platform || !URL.trim()}
								>
									{platform === "email" ? "Add email" : "Add link"}
								</Button>
							</div>
						)}
					</form.Subscribe>
				</fieldset>
			) : (
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() => setShowForm(true)}
					disabled={availablePlatforms.length === 0}
					title={
						availablePlatforms.length === 0
							? "Every platform has been added"
							: undefined
					}
				>
					<Plus className="size-4" />
					Add social link
				</Button>
			)}
		</div>
	);
}
