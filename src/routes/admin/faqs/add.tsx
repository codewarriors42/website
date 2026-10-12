import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FaqForm } from "#/components/forms/faq/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";

export const Route = createFileRoute("/admin/faqs/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createFaq = useMutation(
		trpc.faqs.create.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.faqs.getAll.queryKey(),
				});
				await navigate({ to: "/admin/faqs/$id", params: { id } });
			},
		}),
	);

	return (
		<main className="flex h-full min-h-0 w-full flex-col overflow-hidden">
			<FaqForm
				onSubmit={async (values) => {
					await createFaq.mutateAsync(values);
				}}
			/>
		</main>
	);
}
