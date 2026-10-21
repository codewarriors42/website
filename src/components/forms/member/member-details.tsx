import { Button } from "#/components/ui/button.tsx";
import {
	MemberWithIdSchema,
	type MemberWithId,
} from "#/server/db/schema/member.db.type.ts";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import type { Role } from "#/constant/roles.ts";
import { SocialLinks } from "#/components/social-links.tsx";
import { useState, type ReactNode } from "react";
import { Badge } from "#/components/ui/badge.tsx";
import { useImageUrl } from "#/hooks/use-file-url.tsx";

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
	const [deleting, setDeleting] = useState(false);
	const { imgUrl } = useImageUrl(member.image as string);

	const roles = [...(member.roles ?? [])].sort(
		(first, second) =>
			Number(LEADERSHIP_ROLES.has(second)) -
			Number(LEADERSHIP_ROLES.has(first)),
	);
	const socials = member.socials ?? [];

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
				<div className="flex-1 overflow-y-auto mask-b-from-95% scroll-smooth p-5 space-y-7">
					<header className="flex items-center gap-3">
						<Avatar className="size-20">
							<AvatarImage
								src={imgUrl}
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
							<p className="text-sm text-zinc-400">Grade {member.grade}</p>
						</div>
					</header>

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
							<p className="mt-3 text-sm text-zinc-500">No roles assigned.</p>
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
						to="/admin/members/edit/$id"
						params={{ id: member.id }}
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

export function MemberDetailFromUnknown(
	props: Omit<MemberDetailProps, "member"> & { member: unknown },
) {
	const parsed = MemberWithIdSchema.safeParse(props.member);
	if (!parsed.success) return null;
	return <MemberDetail {...props} member={parsed.data} />;
}

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="text-[0.9rem] font-medium text-muted-foreground">
			{children}
		</p>
	);
}
