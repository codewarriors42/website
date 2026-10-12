import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/members/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full h-full flex items-center justify-center text-zinc-400">
			No member selected. Please select a member from the list or create a new
			one.
		</div>
	);
}
