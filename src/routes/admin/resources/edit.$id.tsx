import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { ResourceForm } from "#/components/forms/resource/index.tsx";

export const Route = createFileRoute("/admin/resources/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const listQuery = trpc.resources.getAll.queryOptions();
	const cachedFaq = queryClient
		.getQueryData(listQuery.queryKey)
		?.find((resource) => resource.id === id);
	const {
		data: resource,
		isPending,
		error,
	} = useQuery({
		...trpc.resources.getById.queryOptions({ id }),
		placeholderData: cachedFaq,
	});
	const updateResource = useMutation(
		trpc.resources.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.resources.getAll.queryKey(),
				});
				await navigate({ to: "/admin/resources/$id", params: { id } });
			},
		}),
	);

	if (isPending)
		return <p className="p-5 text-zinc-500">Loading resource...</p>;
	if (error && !resource)
		return <p className="p-5 text-red-400">{error.message}</p>;
	if (!resource)
		return <p className="p-5 text-zinc-500">Resource not found.</p>;

	return (
		<main className="flex flex-col h-full w-full overflow-hidden py-10">
			<ResourceForm
				initialValues={resource}
				onSubmit={async (values) => {
					await updateResource.mutateAsync({ id, ...values });
				}}
			/>
		</main>
	);
}
