import { MemberForm } from "#/components/forms/member/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/members/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createMember = useMutation(
		trpc.members.create.mutationOptions({
			onSuccess: async ({ id }) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.members.getAll.queryKey(),
				});
				await navigate({ to: "/admin/members/$id", params: { id } });
			},
		}),
	);

	return (
		<MemberForm
			onSubmit={async (values) => {
				await createMember.mutateAsync({
					...values,
					image: typeof values.image === "string" ? values.image : "",
				});
			}}
		/>
	);
}
