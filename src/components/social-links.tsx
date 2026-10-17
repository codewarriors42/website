import type { AlumniSocialPlatform } from "#/server/db/schema/alumni.db.type.ts";
import type { ArchivePlatformType } from "#/server/db/schema/archive.db.type.ts";
import type { MemberSocials } from "#/server/db/schema/member.db.type.ts";
import { ExternalLink, Link2, Trash } from "lucide-react";
import { Button } from "./ui/button";

export type SocialLinksTypes =
	| AlumniSocialPlatform
	| MemberSocials
	| ArchivePlatformType;

const formatLabel = (value: string) => {
	const text = value.replace(/[-_]+/g, " ");
	return text.charAt(0).toUpperCase() + text.slice(1);
};

const displayURL = (url: string, platform: SocialLinksTypes) => {
	if (platform === "email") {
		return url.replace(/^mailto:/i, "");
	}
	return url;
};

const SOCIAL_LABELS: Record<SocialLinksTypes, string> = {
	twitter: "Twitter",
	linkedin: "LinkedIn",
	github: "GitHub",
	instagram: "Instagram",
	discord: "Discord",
	email: "Email",
	website: "Website",
	youtube: "YouTube",
	dribbble: "Dribbble",
	behance: "Behance",
	figma: "Figma",
	google_drive: "Google Drive",
};

export type Social<T extends SocialLinksTypes = SocialLinksTypes> = {
	platform: T;
	URL: string;
};
type SocialLinksProps<T extends SocialLinksTypes> = {
	socials: Social<T>[];
	isInForm?: boolean;
	removeSocial?: (platform: T) => void;
};
export function SocialLinks<T extends SocialLinksTypes>({
	socials,
	isInForm,
	removeSocial,
}: SocialLinksProps<T>) {
	return (
		<section className="flex flex-col w-full">
			{socials.length === 0 ? (
				<p className="text-sm text-muted-foreground px-3">No links added.</p>
			) : (
				<ul className="grid gap-2 sm:grid-cols-3 max-h-68 overflow-y-auto">
					{socials.map((social) => {
						const href = displayURL(social.URL, social.platform);
						const tile = (
							<>
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground">
									<Link2 className="size-4" strokeWidth={1.8} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block text-sm font-medium">
										{SOCIAL_LABELS[social.platform] ??
											formatLabel(social.platform)}
									</span>
									<span className="block  text-xs text-muted-foreground truncate line-clamp-1">
										{href
											? displayURL(social.URL, social.platform)
											: "Invalid link"}
									</span>
								</span>
								{href && (
									<ExternalLink className="size-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
								)}
							</>
						);

						return (
							<li key={social.platform} className="min-w-full">
								{href ? (
									<div className="flex p-3 items-center gap-2 border border-border rounded-2xl hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring utline-none transition-colors">
										<a
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex min-w-0 flex-1 items-center gap-3"
										>
											{tile}
										</a>

										{isInForm && (
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={(event) => {
													event.stopPropagation();
													removeSocial?.(social.platform);
												}}
												aria-label="Delete social link"
											>
												<Trash className="size-4 text-destructive" />
											</Button>
										)}
									</div>
								) : (
									<div className="flex items-center gap-3 rounded-lg border border-border p-3 opacity-60">
										{tile}
									</div>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
