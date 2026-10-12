import { AlumniForm } from "#/components/forms/alumni/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/alumnis/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const listQuery = trpc.alumnis.getAll.queryOptions();
	const cachedAlumni = queryClient
		.getQueryData(listQuery.queryKey)
		?.find((alumni) => alumni.id === id);
	const {
		data: alumni,
		isPending,
		error,
	} = useQuery({
		...trpc.alumnis.getById.queryOptions({ id }),
		placeholderData: cachedAlumni,
	});

	const updateAlumni = useMutation(
		trpc.alumnis.update.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.alumnis.getAll.queryKey(),
				});
				await navigate({ to: "/admin/alumnis/$id", params: { id } });
			},
		}),
	);

	if (isPending) return <p className="p-5 text-zinc-500">Loading alumni...</p>;
	if (error && !alumni)
		return <p className="p-5 text-red-400">{error.message}</p>;
	if (!alumni) return <p className="p-5 text-zinc-500">Alumni not found.</p>;

	return (
		<main className="flex flex-col h-full w-full overflow-hidden py-10">
			<AlumniForm
				initialValues={alumni}
				onSubmit={async (values) => {
					await updateAlumni.mutateAsync({
						...values,
						image: typeof values.image === "string" ? values.image : "",
						id,
					});
				}}
			/>
		</main>
	);
}
