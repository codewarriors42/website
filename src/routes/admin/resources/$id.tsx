import { DeleteConfirmationDialog } from "#/components/forms/confirmation-alert.tsx";
import { ResourceDetails } from "#/components/forms/resource/resources-details.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/resources/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listQuery = trpc.resources.getAll.queryOptions();
	const detailQuery = trpc.resources.getById.queryOptions({ id });
	const {
		data: resources,
		isPending,
		isFetching,
		error,
	} = useQuery({
		...detailQuery,
		placeholderData: () =>
			queryClient
				.getQueryData(listQuery.queryKey)
				?.find((item) => item.id === id),
	});

	const deleteResource = useMutation(
		trpc.resources.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.resources.getAll.queryKey(),
				});
				await navigate({ to: "/admin/resources" });
			},
		}),
	);

	if (isPending) return <p className="p-8">Loading Resources...</p>;
	if (error && !resources)
		return <p className="p-8 text-destructive">{error.message}</p>;
	if (!resources) return <p className="p-8">Resource not found.</p>;

	return (
		<div className="relative h-full">
			{isFetching && (
				<span className="absolute right-0 top-0 text-xs text-zinc-500">
					Refreshing...
				</span>
			)}
			<ResourceDetails
				resource={resources}
				onEdit={() => undefined}
				onDelete={() => setIsDeleteDialogOpen(true)}
			/>
			<DeleteConfirmationDialog
				deleteTile={resources.name}
				isOpen={isDeleteDialogOpen}
				onConfirm={async () => {
					await deleteResource.mutateAsync({ id: resources.id });
					setIsDeleteDialogOpen(false);
				}}
				onClose={() => setIsDeleteDialogOpen(false)}
			/>
		</div>
	);
}
