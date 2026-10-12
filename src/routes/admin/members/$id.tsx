import { MemberDetail } from "#/components/forms/member/member-details.tsx";
import { DeleteConfirmationDialog } from "#/components/forms/member/del-alert.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/members/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listQuery = trpc.members.getAll.queryOptions();
	const detailQuery = trpc.members.getById.queryOptions({ id });
	const {
		data: member,
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

	const deleteMember = useMutation(
		trpc.members.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.members.getAll.queryKey(),
				});
				await navigate({ to: "/admin/members" });
			},
		}),
	);

	if (isPending) return <p className="p-8">Loading member...</p>;
	if (error && !member)
		return <p className="p-8 text-destructive">{error.message}</p>;
	if (!member) return <p className="p-8">Member not found.</p>;

	return (
		<div className="relative h-full">
			{isFetching && (
				<span className="absolute right-0 top-0 text-xs text-zinc-500">
					Refreshing...
				</span>
			)}
			<MemberDetail
				member={member}
				onEdit={() => undefined}
				onDelete={() => setDeleteOpen(true)}
			/>
			<DeleteConfirmationDialog
				isOpen={deleteOpen}
				memberName={member.name}
				deleting={deleteMember.isPending}
				onClose={() => setDeleteOpen(false)}
				onConfirm={async () => {
					await deleteMember.mutateAsync({ id });
					setDeleteOpen(false);
				}}
			/>
		</div>
	);
}
