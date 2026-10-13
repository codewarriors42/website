import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { ArchiveForm } from "#/components/forms/archive/index.tsx";

export const Route = createFileRoute("/admin/archives/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createFaq = useMutation(
		trpc.archives.create.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.archives.getAll.queryKey(),
				});
				await navigate({ to: "/admin/archives/$id", params: { id } });
			},
		}),
	);

	return (
		<main className="flex h-full min-h-0 w-full flex-col overflow-hidden">
			<ArchiveForm
				onSubmit={async (values) => {
					await createFaq.mutateAsync(values);
				}}
			/>
		</main>
	);
}
