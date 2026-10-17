import { DeleteConfirmationDialog } from "#/components/forms/confirmation-alert.tsx";
import { FaqDetails } from "#/components/forms/faq/faq-details.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/faqs/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listQuery = trpc.faqs.getAll.queryOptions();
	const detailQuery = trpc.faqs.getById.queryOptions({ id });
	const {
		data: faqs,
		isPending,
		error,
	} = useQuery({
		...detailQuery,
		placeholderData: () =>
			queryClient
				.getQueryData(listQuery.queryKey)
				?.find((item) => item.id === id),
	});

	const deleteFaq = useMutation(
		trpc.faqs.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.faqs.getAll.queryKey(),
				});
				await navigate({ to: "/admin/faqs" });
			},
		}),
	);

	if (isPending) return <p className="p-8">Loading FAQs...</p>;
	if (error && !faqs)
		return <p className="p-8 text-destructive">{error.message}</p>;
	if (!faqs) return <p className="p-8">FAQ not found.</p>;

	return (
		<div className="relative h-full bg-red-400">
			<FaqDetails
				faq={faqs}
				onEdit={() => undefined}
				onDelete={() => setDeleteOpen(true)}
			/>
			<DeleteConfirmationDialog
				isOpen={deleteOpen}
				deleteTile={faqs.question}
				deleting={deleteFaq.isPending}
				onClose={() => setDeleteOpen(false)}
				onConfirm={async () => {
					await deleteFaq.mutateAsync({ id });
					setDeleteOpen(false);
				}}
			/>
		</div>
	);
}
