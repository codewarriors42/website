import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { ResourceForm } from "#/components/forms/resource/index.tsx";

export const Route = createFileRoute("/admin/resources/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createResource = useMutation(
		trpc.resources.create.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.resources.getAll.queryKey(),
				});
				await navigate({ to: "/admin/resources/$id", params: { id } });
			},
		}),
	);

	return (
		<main className="flex h-full min-h-0 w-full flex-col overflow-hidden">
			<ResourceForm
				onSubmit={async (values) => {
					await createResource.mutateAsync(values);
				}}
			/>
		</main>
	);
}
