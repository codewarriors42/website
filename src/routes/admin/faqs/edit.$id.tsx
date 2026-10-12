import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FaqForm } from "#/components/forms/faq/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";

export const Route = createFileRoute("/admin/faqs/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const listQuery = trpc.faqs.getAll.queryOptions();
	const cachedFaq = queryClient
		.getQueryData(listQuery.queryKey)
		?.find((faq) => faq.id === id);
	const {
		data: faq,
		isPending,
		error,
	} = useQuery({
		...trpc.faqs.getById.queryOptions({ id }),
		placeholderData: cachedFaq,
	});
	const updateFaq = useMutation(
		trpc.faqs.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.faqs.getAll.queryKey(),
				});
				await navigate({ to: "/admin/faqs/$id", params: { id } });
			},
		}),
	);

	if (isPending) return <p className="p-5 text-zinc-500">Loading FAQ...</p>;
	if (error && !faq) return <p className="p-5 text-red-400">{error.message}</p>;
	if (!faq) return <p className="p-5 text-zinc-500">FAQ not found.</p>;

	return (
		<main className="flex flex-col h-full w-full overflow-hidden py-10">
			<FaqForm
				initialValues={faq}
				onSubmit={async (values) => {
					await updateFaq.mutateAsync({ id, ...values });
				}}
			/>
		</main>
	);
}
