import { MemberForm } from "#/components/forms/member/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/members/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const listQuery = trpc.members.getAll.queryOptions();
	const cachedMember = queryClient
		.getQueryData(listQuery.queryKey)
		?.find((member) => member.id === id);
	const {
		data: member,
		isPending,
		error,
	} = useQuery({
		...trpc.members.getById.queryOptions({ id }),
		placeholderData: cachedMember,
	});

	const updateMember = useMutation(
		trpc.members.update.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.members.getAll.queryKey(),
				});
				await navigate({ to: "/admin/members/$id", params: { id } });
			},
		}),
	);

	if (isPending) return <p className="p-5 text-zinc-500">Loading member...</p>;
	if (error && !member)
		return <p className="p-5 text-red-400">{error.message}</p>;
	if (!member) return <p className="p-5 text-zinc-500">Member not found.</p>;

	return (
		<MemberForm
			initialValues={member}
			onSubmit={async (values) => {
				await updateMember.mutateAsync({
					...values,
					image: typeof values.image === "string" ? values.image : "",
					id,
				});
			}}
		/>
	);
}
