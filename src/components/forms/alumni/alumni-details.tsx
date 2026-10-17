import { Link2, Mail } from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button.tsx";
import type { Role } from "#/constant/roles.ts";
import {
	ALUMNI_SOCIAL_PLATFORMS,
	type AlumniSocial,
	type AlumniWithId,
} from "#/server/db/schema/alumni.db.type.ts";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "#/components/ui/badge.tsx";
import { SocialLinks } from "#/components/social-links.tsx";

type AlumniDetailProps = {
	alumni: AlumniWithId;
	onEdit?: () => void;
	onDelete?: () => void;
};
const SOCIAL_ICONS: Partial<
	Record<AlumniSocial["platform"], ComponentType<{ className?: string }>>
> = { email: Mail };

for (const platform of ALUMNI_SOCIAL_PLATFORMS) {
	if (platform !== "email") SOCIAL_ICONS[platform] = Link2;
}

function initials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

function formatRole(role: Role) {
	return role.replaceAll("_", " ");
}

export function AlumniDetail({ alumni, onEdit, onDelete }: AlumniDetailProps) {
	const [deleting, setDeleting] = useState(false);

	const socials = alumni.socials ?? [];
	const roles = alumni.roles ?? [];

	async function handleDelete() {
		setDeleting(true);
		try {
			await onDelete?.();
		} finally {
			setDeleting(false);
		}
	}
	return (
		<div className="flex h-full overflow-hidden bg-background text-foreground">
			<div className="w-full flex flex-col justify-between">
				<div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-7">
					<header className="flex items-center gap-2">
						<Avatar className="size-20">
							<AvatarImage
								src={
									typeof alumni.image === "string" ? alumni.image : undefined
								}
								alt={`${alumni.name} profile`}
								className="object-cover"
							/>
							<AvatarFallback className="text-xl font-semibold">
								{initials(alumni.name) || "?"}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<h1 className="truncate text-2xl font-semibold tracking-tight">
								{alumni.name}
							</h1>
							<p className="mt-1 text-sm text-zinc-400">
								Graduated {alumni.year}
							</p>
						</div>
					</header>

					<section className="mt-5">
						<Eyebrow>Current Position</Eyebrow>
						{alumni.current ? (
							<p className="mt-2 px-2 text-sm">{alumni.current}</p>
						) : (
							<p className="mt-2 px-2 text-sm text-zinc-500">Undefined</p>
						)}
					</section>

					<section>
						{alumni.post && !alumni.roles?.length && (
							<>
								<Eyebrow>Posts</Eyebrow>
								<ul className="mt-3 flex flex-wrap gap-2">
									<Badge
										key={alumni.post}
										variant="secondary"
										className="capitalize"
									>
										{alumni.post}
									</Badge>
								</ul>
							</>
						)}
					</section>

					<section>
						<Eyebrow>Roles</Eyebrow>
						{roles.length > 0 ? (
							<ul className="mt-3 flex flex-wrap gap-2">
								{roles.map((role) => (
									<Badge key={role} variant="secondary" className="capitalize">
										{formatRole(role)}
									</Badge>
								))}
							</ul>
						) : (
							<p className="mt-1 px-2 text-sm text-zinc-500">
								No roles assigned.
							</p>
						)}
					</section>

					<section>
						<Eyebrow>Social Links</Eyebrow>
						<div className="py-3">
							<SocialLinks socials={socials} />
						</div>
					</section>
				</div>

				<footer className="flex items-center gap-2 p-5 md:max-w-sm">
					<Link
						to="/admin/alumnis/edit/$id"
						params={{ id: alumni.id }}
						className="flex-1 h-full"
					>
						<Button type="button" onClick={onEdit} className={"size-full"}>
							Edit
						</Button>
					</Link>

					<Button
						className="flex-1"
						type="button"
						variant="destructive"
						onClick={() => void handleDelete()}
					>
						{deleting ? "Deleting..." : "Delete"}
					</Button>
				</footer>
			</div>
		</div>
	);
}

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="text-[0.9rem] font-medium text-muted-foreground">
			{children}
		</p>
	);
}
