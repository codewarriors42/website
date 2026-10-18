import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { useTRPC } from "#/integrations/trpc/react.ts";
import type { ContactInfoTypeWithId } from "#/server/db/schema/contact.db.type.ts";
import { ContactForm } from ".";

const initials = (text: string) =>
	text
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

type View =
	| { type: "list" }
	| { type: "create" }
	| { type: "edit"; id: string };

const HEADERS = {
	list: { title: "Contacts", description: "People who can be reached." },
	create: { title: "New contact", description: "Create a new contact." },
	edit: {
		title: "Edit contact",
		description: "Update this contact's details.",
	},
} as const;

export function ContactManage() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const {
		data: contacts,
		isLoading,
		error,
	} = useQuery(trpc.contacts.getAll.queryOptions());

	const [view, setView] = useState<View>({ type: "list" });
	const [confirmingId, setConfirmingId] = useState<string | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const refresh = () =>
		queryClient.invalidateQueries({
			queryKey: trpc.contacts.getAll.queryKey(),
		});

	const createContact = useMutation(
		trpc.contacts.create.mutationOptions({ onSuccess: refresh }),
	);
	const updateContact = useMutation(
		trpc.contacts.update.mutationOptions({ onSuccess: refresh }),
	);
	const deleteContact = useMutation(
		trpc.contacts.delete.mutationOptions({ onSuccess: refresh }),
	);

	const editing =
		view.type === "edit" ? contacts?.find((c) => c.id === view.id) : undefined;
	const header = HEADERS[view.type];
	const backToList = () => setView({ type: "list" });

	function askDelete(id: string | null) {
		setDeleteError(null);
		setConfirmingId(id);
	}

	async function handleDelete(id: string) {
		setDeleteError(null);
		try {
			await deleteContact.mutateAsync({ id });
			setConfirmingId(null);
		} catch (err) {
			setDeleteError(
				err instanceof Error
					? err.message
					: "Couldn't delete this contact. Try again.",
			);
		}
	}

	return (
		<div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
			{/* One header for every screen */}
			<header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
				<div className="min-w-0">
					<h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
						{header.title}
						{view.type === "list" && contacts && (
							<Badge variant="secondary" className="tabular-nums">
								{contacts.length}
							</Badge>
						)}
					</h1>
					<p className="text-sm text-muted-foreground">{header.description}</p>
				</div>

				{view.type === "list" ? (
					<Button
						type="button"
						size="sm"
						onClick={() => setView({ type: "create" })}
					>
						Add
					</Button>
				) : (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={backToList}
					>
						Cancel
					</Button>
				)}
			</header>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{view.type === "create" && (
					<div className="p-5">
						<ContactForm
							onSubmit={async (values) => {
								await createContact.mutateAsync(values);
								backToList();
							}}
						/>
					</div>
				)}

				{view.type === "edit" &&
					(editing ? (
						<div className="p-5">
							<ContactForm
								key={editing.id} // switching contacts starts a fresh form
								initialValues={editing}
								onSubmit={async (values) => {
									await updateContact.mutateAsync({
										id: editing.id,
										...values,
									});
									backToList();
								}}
							/>
						</div>
					) : (
						<div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
							<p className="text-sm text-muted-foreground">
								This contact no longer exists.
							</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={backToList}
							>
								Back to contacts
							</Button>
						</div>
					))}

				{view.type === "list" && (
					<ContactList
						data={contacts}
						isLoading={isLoading}
						error={error}
						confirmingId={confirmingId}
						isDeleting={deleteContact.isPending}
						deleteError={deleteError}
						onAsk={askDelete}
						onEdit={(id) => setView({ type: "edit", id })}
						onDelete={handleDelete}
						onAdd={() => setView({ type: "create" })}
					/>
				)}
			</div>
		</div>
	);
}

type ContactListProps = {
	data: ContactInfoTypeWithId[] | undefined;
	isLoading: boolean;
	error: unknown;
	confirmingId: string | null;
	isDeleting: boolean;
	deleteError: string | null;
	onAsk: (id: string | null) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onAdd: () => void;
};

const CONTACT_LIST_SKELETON_KEYS = [
	"contact-skeleton-1",
	"contact-skeleton-2",
	"contact-skeleton-3",
	"contact-skeleton-4",
] as const;

function ContactList({
	data,
	isLoading,
	error,
	confirmingId,
	isDeleting,
	deleteError,
	onAsk,
	onEdit,
	onDelete,
	onAdd,
}: ContactListProps) {
	if (isLoading) {
		return (
			<ul className="divide-y divide-border" aria-busy="true">
				{CONTACT_LIST_SKELETON_KEYS.map((key) => (
					<li key={key} className="flex items-center gap-3 px-5 py-4">
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
				{error instanceof Error ? error.message : "Couldn't load the contacts."}
			</p>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="flex flex-col items-center gap-4 px-5 py-14 text-center">
				<div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
					<Info className="size-5" strokeWidth={1.6} />
				</div>
				<div>
					<p className="font-medium">No contacts yet</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Add the first one to get started.
					</p>
				</div>
				<Button type="button" variant="outline" size="sm" onClick={onAdd}>
					Add contact
				</Button>
			</div>
		);
	}

	return (
		<>
			{deleteError && (
				<p
					role="alert"
					className="border-b border-border px-5 py-3 text-sm text-destructive"
				>
					{deleteError}
				</p>
			)}

			<ul className="divide-y divide-border">
				{data.map((contact) => {
					const confirming = confirmingId === contact.id;

					return (
						<li
							key={contact.id}
							className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/30"
						>
							<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
								{initials(contact.post)}
							</div>

							<div className="min-w-0 flex-1">
								<p className="truncate font-medium">{contact.post}</p>
								<p className="truncate text-sm text-muted-foreground">
									{contact.mail}
								</p>
							</div>

							{confirming ? (
								<div className="flex w-full items-center justify-end gap-2 sm:w-auto">
									<span className="mr-auto text-sm text-muted-foreground sm:mr-2">
										Delete this contact?
									</span>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										disabled={isDeleting}
										onClick={() => onAsk(null)}
									>
										Cancel
									</Button>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										disabled={isDeleting}
										onClick={() => onDelete(contact.id)}
									>
										{isDeleting ? "Deleting…" : "Delete"}
									</Button>
								</div>
							) : (
								<div className="flex items-center gap-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => onEdit(contact.id)}
										aria-label={`Edit ${contact.post}`}
										title="Edit contact"
										className="size-9 text-muted-foreground hover:text-foreground"
									>
										<Pencil className="size-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => onAsk(contact.id)}
										aria-label={`Delete ${contact.post}`}
										title="Delete contact"
										className="size-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
}
