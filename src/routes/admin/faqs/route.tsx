import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";

import { faqText } from "#/hooks/search.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { List } from "#/components/list.tsx";
import { FaqLink } from "#/components/list-links.tsx";

export const Route = createFileRoute("/admin/faqs")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();

	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const {
		data: faqs,
		isPending,
		error,
	} = useQuery(trpc.faqs.getAll.queryOptions());

	// Landing on /admin/faqs opens the first FAQ
	if (
		(pathname === "/admin/faqs" || pathname === "/admin/faqs/") &&
		faqs?.[0]
	) {
		return (
			<Navigate to="/admin/faqs/$id" params={{ id: faqs[0].id }} replace />
		);
	}

	return (
		<main className="h-full w-full overflow-hidden text-foreground">
			<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
				<div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:grid-rows-1">
					<List
						label="FAQs"
						singular="FAQ"
						addTo="/admin/faqs/add"
						cancelTo="/admin/faqs"
						data={faqs}
						isPending={isPending}
						error={error}
						pathname={pathname}
						getText={faqText}
						renderItem={(faq, close) => <FaqLink item={faq} onClick={close} />}
					/>
					<section className="min-h-0 overflow-y-auto">
						<Outlet />
					</section>
				</div>
			</div>
		</main>
	);
}
