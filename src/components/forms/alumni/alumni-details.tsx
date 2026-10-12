import { ExternalLink, Link2, Mail, Pencil, Trash2 } from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";
import type { Role } from "#/constant/roles.ts";
import {
	ALUMNI_SOCIAL_PLATFORMS,
	type AlumniSocial,
	type AlumniWithId,
} from "#/server/db/schema/alumni.db.type.ts";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "#/components/ui/badge.tsx";

type AlumniDetailProps = {
	alumni: AlumniWithId;
	onEdit?: () => void;
	onDelete?: () => void;
};

const SOCIAL_LABELS: Record<AlumniSocial["platform"], string> = {
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
	const socials = alumni.socials ?? [];
	const roles = alumni.roles ?? [];

	return (
		<article className="flex h-full min-h-0 scale-95 flex-col overflow-hidden text-zinc-100">
			<div className="min-h-0 flex-1 overflow-y-auto p-5">
				<header className="flex items-center gap-2">
					<Avatar className="size-20">
						<AvatarImage
							src={typeof alumni.image === "string" ? alumni.image : undefined}
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
					<p className="text-sm font-medium text-zinc-400">Current position</p>
					{alumni.current ? (
						<p className="mt-3 text-sm text-zinc-200">{alumni.current}</p>
					) : (
						<p className="mt-3 text-sm text-zinc-500">Undefine</p>
					)}
				</section>

				<section className="mt-5">
					{alumni.post && (
						<>
							<p className="text-sm font-medium text-zinc-400">Posts</p>
							<ul className="mt-3 flex flex-wrap gap-2">
								<li
									className={cn(
										"rounded-md px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
										"bg-white/5 text-zinc-300 ring-white/10",
									)}
								>
									{alumni.post}
								</li>
							</ul>
						</>
					)}
				</section>

				<section className="mt-5">
					<p className="text-sm font-medium text-zinc-400">
						Role
						<Badge
							variant={"secondary"}
							className="rounded-md m-1 text-[10px] font-medium"
						>
							New
						</Badge>
					</p>
					{roles.length > 0 ? (
						<ul className="mt-3 flex flex-wrap gap-2">
							{roles.map((role) => (
								<li
									key={role}
									className={cn(
										"rounded-md px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
										"bg-white/5 text-zinc-300 ring-white/10",
									)}
								>
									{formatRole(role)}
								</li>
							))}
						</ul>
					) : (
						<p className="mt-3 text-sm text-zinc-500">No posts assigned.</p>
					)}
				</section>

				<section className="mt-5">
					<p className="text-sm font-medium text-zinc-400">Socials</p>
					{socials.length > 0 ? (
						<ul className="mt-3 grid grid-cols-2 overflow-clip rounded-lg border border-white/10">
							{socials.map((social) => {
								const Icon = SOCIAL_ICONS[social.platform] ?? ExternalLink;
								const content = (
									<>
										<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
											<Icon className="size-4" />
										</span>
										<span className="text-sm font-medium text-zinc-200">
											{SOCIAL_LABELS[social.platform]}
										</span>
										<span className="ml-auto min-w-0 truncate text-sm text-zinc-500">
											{social.URL}
										</span>
										<ExternalLink className="size-4 shrink-0 text-zinc-600" />
									</>
								);

								return (
									<li key={social.platform}>
										<a
											href={social.URL}
											target={
												social.platform === "email" ? undefined : "_blank"
											}
											rel="noopener noreferrer"
											className="group flex items-center gap-3 px-5 py-2 hover:bg-white/5"
										>
											{content}
										</a>
									</li>
								);
							})}
						</ul>
					) : (
						<p className="mt-3 text-sm text-zinc-500">No links added.</p>
					)}
				</section>
			</div>

			<footer className="flex shrink-0 items-start gap-4 px-5 py-7 sm:px-7">
				<Link to="/admin/alumnis/edit/$id" params={{ id: alumni.id }}>
					<Button type="button" onClick={onEdit}>
						<Pencil className="size-4" />
						Edit
					</Button>
				</Link>
				<Button
					type="button"
					variant="outline"
					onClick={onDelete}
					className="border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
				>
					<Trash2 className="size-4" />
					Delete
				</Button>
			</footer>
		</article>
	);
}
