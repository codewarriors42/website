import { Pencil, Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import {
	MemberWithIdSchema,
	type MemberWithId,
} from "#/server/db/schema/member.db.type.ts";
import { cn } from "#/lib/utils.ts";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import type { Role } from "#/constant/roles.ts";
import { SocialLinks } from "#/components/social-links.tsx";

type MemberDetailProps = {
	member: MemberWithId;
	onEdit?: () => void;
	onDelete?: () => void;
};

const LEADERSHIP_ROLES = new Set<Role>([
	"vice_president",
	"president",
	"creative_head",
	"quiz_corss_head",
	"programming_head",
	"group_discussion_head",
	"head_developer",
]);

function formatRole(role: Role) {
	return role.replaceAll("_", " ");
}

function initials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

export function MemberDetail({ member, onEdit, onDelete }: MemberDetailProps) {
	const roles = [...(member.roles ?? [])].sort(
		(first, second) =>
			Number(LEADERSHIP_ROLES.has(second)) -
			Number(LEADERSHIP_ROLES.has(first)),
	);
	const socials = member.socials ?? [];

	return (
		<article className="flex h-full min-h-0 flex-col text-zinc-100 scale-95 overflow-hidden">
			<div className="min-h-0 flex-1 overflow-y-auto p-5">
				<header className="flex items-center gap-2">
					<Avatar className="size-20">
						<AvatarImage
							src={member.image as string}
							alt="Photo preview"
							className="object-cover"
						/>
						<AvatarFallback className="text-xl font-semibold">
							{initials(member.name) || "?"}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<h1 className="truncate text-2xl font-semibold tracking-tight">
							{member.name}
						</h1>
						<p className="mt-1 text-sm text-zinc-400">Grade {member.grade}</p>
					</div>
				</header>

				<section className="mt-5">
					<p className="text-sm font-medium text-zinc-400">Roles</p>
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
						<p className="mt-3 text-sm text-zinc-500">No roles assigned.</p>
					)}
				</section>

				<section className="mt-8">
					<p className="text-sm font-medium text-zinc-400">Social Links</p>
					<SocialLinks socials={socials} />
				</section>
			</div>

			<footer className="flex  shrink-0 items-start gap-4 px-5 py-7 sm:px-7">
				<Link to="/admin/members/edit/$id" params={{ id: member.id }}>
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

export function MemberDetailFromUnknown(
	props: Omit<MemberDetailProps, "member"> & { member: unknown },
) {
	const parsed = MemberWithIdSchema.safeParse(props.member);
	if (!parsed.success) return null;
	return <MemberDetail {...props} member={parsed.data} />;
}
