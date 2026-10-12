import { useTRPC } from "#/integrations/trpc/react.ts";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const trpc = useTRPC();
	const todosQuery = useQuery(trpc.members.getAll.queryOptions());

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			{todosQuery.isPending && <p className="mt-4">Loading...</p>}
			{todosQuery.data && (
				<ul className="mt-4 list-disc pl-6">
					{todosQuery.data.map((todo) => (
						<li key={todo.id}>{todo.name}</li>
					))}
				</ul>
			)}
		</div>
	);
}
