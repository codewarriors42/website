import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { AlumniLink } from "#/components/list-links.tsx";
import { alumniText } from "#/hooks/search.tsx";
import { List } from "#/components/list.tsx";

export const Route = createFileRoute("/admin/alumnis")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const {
		data: alumni,
		isPending,
		error,
	} = useQuery(trpc.alumnis.getAll.queryOptions());

	if (
		(pathname === "/admin/alumnis" || pathname === "/admin/alumnis/") &&
		alumni?.[0]
	) {
		return (
			<Navigate to="/admin/alumnis/$id" params={{ id: alumni[0].id }} replace />
		);
	}
	return (
		<main className="h-full w-full overflow-hidden text-foreground">
			<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
				<div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:grid-rows-1">
					<List
						label="Alumnis"
						singular="Alumnus"
						addTo="/admin/alumnis/add"
						cancelTo="/admin/alumnis"
						data={alumni}
						isPending={isPending}
						error={error}
						pathname={pathname}
						getText={alumniText}
						renderItem={(alumnus, close) => (
							<AlumniLink item={alumnus} onClick={close} />
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
