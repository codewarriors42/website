import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	Navigate,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import type { ArchiveType } from "#/server/db/schema/archive.db.type.ts";

type ArchiveListItem = ArchiveType & { id: string };

export const Route = createFileRoute("/admin/archives")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const {
		data: archives,
		isPending,
		error,
	} = useQuery(trpc.archives.getAll.queryOptions());

	if (
		(pathname === "/admin/archives" || pathname === "/admin/archives/") &&
		archives?.[0]
	) {
		return (
			<Navigate
				to="/admin/archives/$id"
				params={{ id: archives[0].id }}
				replace
			/>
		);
	}

	return (
		<main className="dark h-full w-full overflow-hidden text-zinc-100">
			<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
				<div className="grid min-h-0 flex-1 grid-rows-[minmax(9rem,0.65fr)_minmax(0,1.35fr)] lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:grid-rows-1">
					<ArchiveList
						archives={archives}
						isPending={isPending}
						error={error}
					/>
					<section className="min-h-0 overflow-y-auto">
						<Outlet />
					</section>
				</div>
			</div>
		</main>
	);
}

function ArchiveList({
	archives,
	isPending,
	error,
}: {
	archives: ArchiveListItem[] | undefined;
	isPending: boolean;
	error: unknown;
}) {
	const [search, setSearch] = useState("");
	const filteredArchives = archives?.filter((archive) =>
		archive.title.toLowerCase().includes(search.toLowerCase()),
	);
	const archivesByYear = filteredArchives?.reduce<
		Record<number, ArchiveListItem[]>
	>((groups, archive) => {
		if (!groups[archive.year]) {
			groups[archive.year] = [];
		}
		groups[archive.year].push(archive);
		return groups;
	}, {});
	const yearGroups = Object.entries(archivesByYear ?? {}).sort(
		([yearA], [yearB]) => Number(yearB) - Number(yearA),
	);

	return (
		<aside className="flex min-h-0 flex-col overflow-hidden border-r border-white/10 p-5">
			<div className="flex items-center justify-between px-1 pb-3">
				<div className="flex items-center gap-2">
					<div>
						<h2 className="font-semibold text-zinc-100">
							Achives
							<Badge variant="secondary" className="ml-2 text-xs">
								{archives?.length ?? 0}
							</Badge>
						</h2>
						<h2 className="text-xs text-zinc-500">Directory</h2>
					</div>
				</div>
				<Link to="/admin/archives/add">
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 p-0"
						title="Add archive"
					>
						<Plus className="size-4" />
					</Button>
				</Link>
			</div>
			<div className="relative mb-3">
				<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search archives"
					className="h-10 border-white/10 bg-black/10 pl-9 text-sm text-zinc-100 placeholder:text-zinc-600"
				/>
			</div>
			<ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
				{isPending ? (
					<li className="px-3 py-4 text-sm text-zinc-500">
						Loading archives...
					</li>
				) : error ? (
					<li className="px-3 py-4 text-sm text-red-400">
						{error instanceof Error
							? error.message
							: "Unable to load archives."}
					</li>
				) : filteredArchives?.length ? (
					yearGroups.map(([year, yearArchives]) => (
						<li key={year}>
							<h3 className="px-3 pb-1 pt-3 text-xs font-semibold text-zinc-500">
								{year}
							</h3>
							<ul className="space-y-2">
								{yearArchives.map((archive) => (
									<li key={archive.id}>
										<Link
											to="/admin/archives/$id"
											params={{ id: archive.id }}
											activeProps={{
												className:
													"bg-teal-500/20 text-teal-300 hover:bg-teal-500/10",
											}}
											className="group flex items-center justify-between gap-5 rounded-md border px-3 py-2.5 hover:bg-white/5 hover:text-zinc-100 focus:outline-none"
										>
											<span className="min-w-0">
												<span className="block truncate text-sm font-medium text-zinc-200">
													{archive.title}
												</span>
												<span className="block truncate text-xs font-medium text-zinc-400">
													{archive.event}
												</span>
											</span>
											<ArrowUpRight className="size-4 shrink-0 text-zinc-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
										</Link>
									</li>
								))}
							</ul>
						</li>
					))
				) : (
					<li className="rounded-xl border border-dashed border-white/10 px-3 py-5 text-center text-sm text-zinc-500">
						No archives found.
					</li>
				)}
			</ul>
		</aside>
	);
}
