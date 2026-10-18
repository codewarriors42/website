import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import { AdminUserForm } from ".";

const initials = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

export function UserManage() {
	const trpc = useTRPC();
	const {
		data: users,
		isLoading,
		error,
	} = useQuery(trpc.users.getAll.queryOptions());

	const [formOpen, setFormOpen] = useState(false);
	const [confirmingId, setConfirmingId] = useState<string | null>(null);

	const queryClient = useQueryClient();
	const createUser = useMutation(
		trpc.users.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.users.getAll.queryKey(),
				});
			},
		}),
	);

	const deleteUser = useMutation(
		trpc.users.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.users.getAll.queryKey(),
				});
			},
		}),
	);

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
				<div className="min-w-0">
					<h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
						{formOpen ? "New admin user" : "Admin users"}
						{!formOpen && users && (
							<Badge variant="secondary" className="tabular-nums">
								{users.length}
							</Badge>
						)}
					</h1>
					<p className="text-sm text-muted-foreground">
						{formOpen
							? "Create an account that can sign in to the dashboard."
							: "People who can sign in to this dashboard."}
					</p>
				</div>

				{formOpen ? (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setFormOpen(false)}
					>
						Cancel
					</Button>
				) : (
					<Button type="button" size="sm" onClick={() => setFormOpen(true)}>
						Add
					</Button>
				)}
			</header>
			<div className="flex-1 flex flex-col justify-center">
				{formOpen ? (
					<AdminUserForm
						onSubmit={async (data) => {
							await createUser.mutateAsync(data);
							setFormOpen(false);
						}}
					/>
				) : (
					<div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
						<UserList
							users={users}
							isLoading={isLoading}
							error={error}
							confirmingId={confirmingId}
							onAsk={setConfirmingId}
							onDelete={async (id) => {
								await deleteUser.mutateAsync({ id });
								setConfirmingId(null);
							}}
							onAdd={() => setFormOpen(true)}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

type UserListProps = {
	users: { id: string; name: string; username: string }[] | undefined;
	isLoading: boolean;
	error: unknown;
	confirmingId: string | null;
	onAsk: (id: string | null) => void;
	onDelete: (id: string) => void;
	onAdd: () => void;
};

function UserList({
	users,
	isLoading,
	error,
	confirmingId,
	onAsk,
	onDelete,
	onAdd,
}: UserListProps) {
	if (isLoading) {
		return (
			<ul className="divide-y divide-border" aria-busy="true">
				{Array.from({ length: 4 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
					<li key={i} className="flex items-center gap-3 px-5 py-4">
						<div className="size-10 animate-pulse rounded-full bg-muted" />
						<div className="space-y-2">
							<div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
							<div className="h-3 w-20 animate-pulse rounded bg-muted" />
						</div>
					</li>
				))}
			</ul>
		);
	}

	if (error) {
		return (
			<p
				role="alert"
				className="px-5 py-8 text-center text-sm text-destructive"
			>
				{error instanceof Error
					? error.message
					: "Couldn't load the admin users."}
			</p>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className="flex flex-col items-center gap-4 px-5 py-14 text-center">
				<div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
					<Users className="size-5" strokeWidth={1.6} />
				</div>
				<div>
					<p className="font-medium">No admin users yet</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Add the first one to get started.
					</p>
				</div>
				<Button type="button" variant="outline" size="sm" onClick={onAdd}>
					<UserPlus className="size-4" />
					Add admin
				</Button>
			</div>
		);
	}

	return (
		<ul className="divide-y divide-border">
			{users.map((user) => {
				const confirming = confirmingId === user.id;

				return (
					<li
						key={user.id}
						className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/30"
					>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
							{initials(user.name)}
						</div>

						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">{user.name}</p>
							<p className="truncate text-sm text-muted-foreground">
								@{user.username}
							</p>
						</div>

						{confirming ? (
							<div className="flex w-full items-center justify-end gap-2 sm:w-auto">
								<span className="mr-auto text-sm text-muted-foreground sm:mr-2">
									Delete this user?
								</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onAsk(null)}
								>
									Cancel
								</Button>
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={() => onDelete(user.id)}
								>
									Delete
								</Button>
							</div>
						) : (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onAsk(user.id)}
								aria-label={`Delete ${user.name}`}
								title="Delete user"
								className="size-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
							>
								<Trash2 className="size-4" />
							</Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}
