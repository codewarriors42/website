import { AlumniForm } from "#/components/forms/alumni/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Alumni } from "#/server/db/schema/alumni.db.type.ts";

export const Route = createFileRoute("/admin/alumnis/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createAlumni = useMutation(
		trpc.alumnis.create.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.alumnis.getAll.queryKey(),
				});
				await navigate({ to: "/admin/alumnis/$id", params: { id } });
			},
		}),
	);

	return (
		<main className="flex flex-col h-full w-full overflow-hidden py-10">
			<AlumniForm
				onSubmit={async (values) => {
					const alumni: Alumni = {
						...values,
						image: typeof values.image === "string" ? values.image : "",
					};
					await createAlumni.mutateAsync(alumni);
				}}
			/>
		</main>
	);
}
