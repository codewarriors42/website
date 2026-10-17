import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { AlumniWithId } from "#/server/db/schema/alumni.db.type.ts";
import type { FaqTypeWithId } from "#/server/db/schema/faq.db.type.ts";
import type { MemberWithId } from "#/server/db/schema/member.db.type.ts";
import type { ArchiveTypeWithId } from "#/server/db/schema/archive.db.type.ts";
import type { ResourceTypeWithId } from "#/server/db/schema/resource.db.type.ts";

export const listLinkClass = `
	group flex items-center justify-between gap-4 rounded-2xl border border-transparent px-4 py-2.5
	text-sm text-muted-foreground outline-none transition-colors
	hover:bg-accent/50 hover:text-foreground
	focus-visible:ring-2 focus-visible:ring-ring
	data-[status=active]:border-border data-[status=active]:bg-accent data-[status=active]:text-accent-foreground
`;

function Arrow() {
	return (
		<ArrowUpRight className="size-4 shrink-0 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
	);
}

type LinkProps<T> = { item: T; onClick?: () => void };

export function FaqLink({ item, onClick }: LinkProps<FaqTypeWithId>) {
	return (
		<Link
			to="/admin/faqs/$id"
			params={{ id: item.id }}
			onClick={onClick}
			className={listLinkClass}
		>
			<span className="line-clamp-2 min-w-0 font-medium">{item.question}</span>
			<Arrow />
		</Link>
	);
}

export function MemberLink({ item, onClick }: LinkProps<MemberWithId>) {
	return (
		<Link
			to="/admin/members/$id"
			params={{ id: item.id }}
			onClick={onClick}
			className={listLinkClass}
		>
			<span className="min-w-0">
				<span className="block truncate font-medium">{item.name}</span>
				<span className="block text-xs opacity-70">Grade {item.grade}</span>
			</span>
			<Arrow />
		</Link>
	);
}

export function AlumniLink({ item, onClick }: LinkProps<AlumniWithId>) {
	return (
		<Link
			to="/admin/alumnis/$id"
			params={{ id: item.id }}
			onClick={onClick}
			className={listLinkClass}
		>
			<span className="min-w-0">
				<span className="block truncate font-medium">{item.name}</span>
				<span className="block text-xs opacity-70">
					Pass out year {item.year}
				</span>
			</span>
			<Arrow />
		</Link>
	);
}

export function ArchiveLink({ item, onClick }: LinkProps<ArchiveTypeWithId>) {
	return (
		<Link
			to="/admin/archives/$id"
			params={{ id: item.id }}
			onClick={onClick}
			className={listLinkClass}
		>
			<span className="min-w-0">
				<span className="block truncate font-medium">{item.title}</span>
				<span className="block text-xs opacity-70">{item.event}</span>
			</span>
			<Arrow />
		</Link>
	);
}

export function ResourceLink({ item, onClick }: LinkProps<ResourceTypeWithId>) {
	return (
		<Link
			to="/admin/resources/$id"
			params={{ id: item.id }}
			onClick={onClick}
			className={listLinkClass}
		>
			<span className="line-clamp-2 min-w-0 font-medium">{item.name}</span>
			<Arrow />
		</Link>
	);
}
