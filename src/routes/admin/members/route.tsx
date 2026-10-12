import { useTRPC } from "#/integrations/trpc/react.ts";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { List } from "#/components/list.tsx";
import { memberText } from "#/hooks/search.tsx";
import { MemberLink } from "#/components/list-links.tsx";

export const Route = createFileRoute("/admin/members")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const {
		data: members,
		isPending,
		error,
	} = useQuery(trpc.members.getAll.queryOptions());

	if (
		(pathname === "/admin/members" || pathname === "/admin/members/") &&
		members?.[0]
	) {
		return (
			<Navigate
				to="/admin/members/$id"
				params={{ id: members[0].id }}
				replace
			/>
		);
	}

	return (
		<main className="h-full w-full overflow-hidden text-foreground">
			<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
				<div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:grid-rows-1">
					<List
						label="Members"
						singular="Member"
						addTo="/admin/members/add"
						cancelTo="/admin/members"
						data={members}
						isPending={isPending}
						error={error}
						pathname={pathname}
						getText={memberText}
						renderItem={(member, close) => (
							<MemberLink item={member} onClick={close} />
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
