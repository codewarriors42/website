import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";

import { useTRPC } from "#/integrations/trpc/react.ts";
import { List } from "#/components/list.tsx";
import { ArchiveLink } from "#/components/list-links.tsx";
import { archiveText } from "#/hooks/search.tsx";

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

	// Landing on /admin/archives opens the first FAQ
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
		<main className="h-full w-full overflow-hidden text-foreground">
			<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
				<div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:grid-rows-1">
					<List
						label="Archives"
						singular="Archive"
						addTo="/admin/archives/add"
						cancelTo="/admin/archives"
						data={archives}
						isPending={isPending}
						error={error}
						pathname={pathname}
						getText={archiveText}
						renderItem={(archive, close) => (
							<ArchiveLink item={archive} onClick={close} />
						)}
					/>
					<section className="min-h-0 overflow-y-auto">
						<Outlet />
					</section>
				</div>
			</div>
		</main>
	);
}
