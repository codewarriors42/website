import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminUserForm } from "#/components/forms/user/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/add-user")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createUser = useMutation(
		trpc.users.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.users.getAll.queryKey(),
				});
				await navigate({ to: "/admin" });
			},
		}),
	);
	return (
		<AdminUserForm
			onSubmit={async (values) => {
				await createUser.mutateAsync(values);
			}}
		/>
	);
}
