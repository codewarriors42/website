import { ArchiveDetails } from "#/components/forms/archive/archive-details.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/archives/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listQuery = trpc.archives.getAll.queryOptions();
	const detailQuery = trpc.archives.getById.queryOptions({ id });
	const {
		data: archives,
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

	const deleteArchive = useMutation(
		trpc.archives.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.archives.getAll.queryKey(),
				});
				await navigate({ to: "/admin/archives" });
			},
		}),
	);

	if (isPending) return <p className="p-8">Loading archives...</p>;
	if (error && !archives)
		return <p className="p-8 text-destructive">{error.message}</p>;
	if (!archives) return <p className="p-8">Archives not found.</p>;

	return (
		<div className="relative h-full">
			{isFetching && (
				<span className="absolute right-0 top-0 text-xs text-zinc-500">
					Refreshing...
				</span>
			)}
			<ArchiveDetails
				archive={archives}
				onEdit={() => undefined}
				onDelete={async () => {
					deleteArchive.mutate({ id });
				}}
			/>
		</div>
	);
}
