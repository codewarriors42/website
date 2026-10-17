import { ArchiveForm } from "#/components/forms/archive/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/archives/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const listQuery = trpc.archives.getAll.queryOptions();
	const cachedArchives = queryClient
		.getQueryData(listQuery.queryKey)
		?.find((archive) => archive.id === id);
	const {
		data: archive,
		isPending,
		error,
	} = useQuery({
		...trpc.archives.getById.queryOptions({ id }),
		placeholderData: cachedArchives,
	});

	const updateArchive = useMutation(
		trpc.archives.update.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.archives.getAll.queryKey(),
				});
				await navigate({ to: "/admin/archives/$id", params: { id } });
			},
		}),
	);

	if (isPending)
		return <p className="p-5 text-zinc-500">Loading archives...</p>;
	if (error && !archive)
		return <p className="p-5 text-red-400">{error.message}</p>;
	if (!archive) return <p className="p-5 text-zinc-500">Archive not found.</p>;

	return (
		<ArchiveForm
			initialValues={archive}
			onSubmit={async (values) => {
				await updateArchive.mutateAsync({
					...values,
					image: typeof values.image === "string" ? values.image : "",
					id,
				});
			}}
		/>
	);
}
