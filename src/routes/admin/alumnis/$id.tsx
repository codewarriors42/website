import { AlumniDetail } from "#/components/forms/alumni/alumni-details.tsx";
import { DeleteConfirmationDialog } from "#/components/forms/confirmation-alert.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/alumnis/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listQuery = trpc.alumnis.getAll.queryOptions();
	const detailQuery = trpc.alumnis.getById.queryOptions({ id });
	const {
		data: alumni,
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

	const deleteAlumni = useMutation(
		trpc.alumnis.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.alumnis.getAll.queryKey(),
				});
				await navigate({ to: "/admin/alumnis" });
			},
		}),
	);

	if (isPending) return <p className="p-8">Loading alumni...</p>;
	if (error && !alumni)
		return <p className="p-8 text-destructive">{error.message}</p>;
	if (!alumni) return <p className="p-8">Alumni not found.</p>;

	return (
		<div className="relative h-full">
			{isFetching && (
				<span className="absolute right-0 top-0 text-xs text-zinc-500">
					Refreshing...
				</span>
			)}
			<AlumniDetail
				alumni={alumni}
				onEdit={() => undefined}
				onDelete={() => setDeleteOpen(true)}
			/>
			<DeleteConfirmationDialog
				isOpen={deleteOpen}
				deleteTile={alumni.name}
				entityLabel="alumni"
				deleting={deleteAlumni.isPending}
				onClose={() => setDeleteOpen(false)}
				onConfirm={async () => {
					await deleteAlumni.mutateAsync({ id });
					setDeleteOpen(false);
				}}
			/>
		</div>
	);
}
