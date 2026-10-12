import { MemberForm } from "#/components/forms/member/index.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button.tsx";
import { ArchiveForm } from "#/components/forms/archive/index.tsx";

export const Route = createFileRoute("/admin/archives/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const createArchive = useMutation(
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
		<main className="h-full min-h-0 overflow-y-auto">
			<header className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 p-5">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Add archive entry</h1>
					<p className="text-sm text-zinc-500">
						Create a new archive entry.
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					className="shrink-0 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
					onClick={() => navigate({ to: "/admin/archives" })}
				>
					Cancel
				</Button>
			</header>

			<ArchiveForm
				onSubmit={async (values) => {
					await createArchive.mutateAsync({
						...values,
						image: typeof values.image === "string" ? values.image : "",
					});
				}}
			/>
		</main>
	);
}
