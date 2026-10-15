import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";

import { useTRPC } from "#/integrations/trpc/react.ts";
import { List } from "#/components/list.tsx";
import { ResourceLink } from "#/components/list-links.tsx";
import { resourceText } from "#/hooks/search.tsx";

export const Route = createFileRoute("/admin/resources")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();

	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const {
		data: resources,
		isPending,
		error,
	} = useQuery(trpc.resources.getAll.queryOptions());

	// Landing on /admin/resources opens the first resource
	if (
		(pathname === "/admin/resources" || pathname === "/admin/resources/") &&
		resources?.[0]
	) {
		return (
			<Navigate
				to="/admin/resources/$id"
				params={{ id: resources[0].id }}
				replace
			/>
		);
	}

	return (
		<main className="h-full w-full overflow-hidden text-foreground">
			<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
				<div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:grid-rows-1">
					<List
						label="Resources"
						singular="Resource"
						addTo="/admin/resources/add"
						cancelTo="/admin/resources"
						data={resources}
						isPending={isPending}
						error={error}
						pathname={pathname}
						getText={resourceText}
						renderItem={(resource, close) => (
							<ResourceLink item={resource} onClick={close} />
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
