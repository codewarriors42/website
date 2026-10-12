import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ExternalLink, Link2, Trash2 } from "lucide-react";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Field, FieldError, FieldLabel } from "../ui/field";
type SocialLink = {
	platform: string;
	URL: string;
};

type SocialFormValues<T extends SocialLink> = {
	allSocials: T[];
	updateSocials: (socials: T[]) => void;
	platforms: readonly T["platform"][];
	schema: z.ZodType<T>;
};

function label(platform: string) {
	return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function AddSocials<T extends SocialLink>({
	allSocials,
	updateSocials,
	platforms,
	schema,
}: SocialFormValues<T>) {
	const [open, setOpen] = useState(false);
	const availablePlatforms = platforms.filter(
		(platform) => !allSocials.some((social) => social.platform === platform),
	);
	const form = useForm({
		defaultValues: { platform: "", URL: "" },
		validators: {
			onChange: ({ value }) => {
				const result = schema.safeParse(value);
				return result.success ? undefined : result.error;
			},
		},
		onSubmit: async ({ value }) => {
			if (allSocials.some((social) => social.platform === value.platform))
				return;
			updateSocials([
				...allSocials,
				{ platform: value.platform, URL: value.URL } as T,
			]);
			form.reset();
			setOpen(false);
		},
	});

	return (
		<div className="space-y-3">
			{allSocials.length > 0 && (
				<div className="divide-x divide-white/10 grid grid-cols-2 overflow-hidden rounded-lg border border-white/10 bg-black/10">
					{allSocials.map((social) => (
						<div
							key={social.platform}
							className="flex min-w-0 items-center gap-2 px-2.5 py-2"
						>
							<span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-zinc-400">
								<Link2 className="size-3.5" />
							</span>
							<span className="w-20 shrink-0 text-xs font-medium text-zinc-300">
								{label(social.platform)}
							</span>
							<a
								href={
									social.platform === "email"
										? `mailto:${social.URL.replace(/^mailto:/i, "")}`
										: social.URL
								}
								target={social.platform === "email" ? undefined : "_blank"}
								rel="noreferrer"
								className="min-w-0 flex-1 truncate text-xs text-zinc-500 hover:text-zinc-200"
							>
								{social.URL}
							</a>
							<ExternalLink className="size-3.5 shrink-0 text-zinc-600" />
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={`Remove ${label(social.platform)} link`}
								className="text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
								onClick={() =>
									updateSocials(
										allSocials.filter(
											(item) => item.platform !== social.platform,
										),
									)
								}
							>
								<Trash2 className="size-3.5" />
							</Button>
						</div>
					))}
				</div>
			)}

			<Dialog
				open={open}
				onOpenChange={(nextOpen) => {
					setOpen(nextOpen);
					if (!nextOpen) form.reset();
				}}
			>
				<DialogTrigger
					render={
						<Button
							type="button"
							variant="outline"
							disabled={availablePlatforms.length === 0}
						>
							{availablePlatforms.length === 0
								? "All platforms added"
								: "Add social"}
						</Button>
					}
				/>
				<DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
					<DialogHeader className="p-5">
						<DialogTitle className="text-lg">Add social link</DialogTitle>
						<DialogDescription className="text-xs -mt-2">
							Add a public profile or contact address.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 px-5 py-4 sm:px-6">
						<form.Field name="platform">
							{(field) => {
								const invalid =
									field.state.meta.isTouched &&
									field.state.meta.isDirty &&
									!field.state.meta.isValid;
								return (
									<Field data-invalid={invalid} className="gap-1.5">
										<FieldLabel
											htmlFor="social-platform"
											className="text-xs text-zinc-400"
										>
											Platform
										</FieldLabel>
										<Select
											value={field.state.value}
											onValueChange={(value) => {
												if (value !== null) field.handleChange(value);
												field.handleBlur();
											}}
										>
											<SelectTrigger
												id="social-platform"
												className="h-9 border-white/10 bg-black/10 text-sm"
												aria-invalid={invalid}
											>
												<SelectValue placeholder="Choose" />
											</SelectTrigger>
											<SelectContent>
												{availablePlatforms.map((platform) => (
													<SelectItem key={platform} value={platform}>
														{label(platform)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="URL">
							{(field) => {
								const invalid =
									field.state.meta.isTouched &&
									field.state.meta.isDirty &&
									!field.state.meta.isValid;
								return (
									<Field data-invalid={invalid} className="gap-1.5">
										<FieldLabel
											htmlFor="social-url"
											className="text-xs text-zinc-400"
										>
											Profile URL
										</FieldLabel>
										<Input
											id="social-url"
											value={field.state.value}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											onBlur={field.handleBlur}
											placeholder="https://..."
											className="border-white/10 bg-black/10 text-sm"
											aria-invalid={invalid}
										/>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</div>
					<DialogFooter className="m-0 gap-2 border-t bg-muted/20 px-5 py-3 sm:px-6">
						<DialogClose>
							<Button
								type="button"
								variant="ghost"
								onClick={() => form.reset()}
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							onClick={() => {
								void form.handleSubmit();
							}}
						>
							Add link
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
