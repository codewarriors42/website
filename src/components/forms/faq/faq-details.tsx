import { Pencil, Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import type { FaqTypeWithId } from "#/server/db/schema/faq.db.type.ts";
import { Link } from "@tanstack/react-router";

type FaqDetailsProps = {
	faq: FaqTypeWithId;
	onEdit: () => void;
	onDelete: () => void | Promise<void>;
};

export function FaqDetails({ faq, onEdit, onDelete }: FaqDetailsProps) {
	const [deleting, setDeleting] = useState(false);

	async function handleDelete() {
		setDeleting(true);
		try {
			await onDelete();
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
			{/* Content */}
			<div className="min-h-0 flex-1 overflow-y-auto">
				{/* Question */}
				<section className="w-full border-b border-border px-5 py-5 sm:px-7">
					<Eyebrow>Question</Eyebrow>
					<h2 className="mt-2 text-2xl font-medium leading-tight text-foreground">
						{faq.question}
					</h2>
				</section>

				{/* Answer */}
				<section className="px-5 py-6 sm:px-7">
					<Eyebrow>Answer</Eyebrow>
					<p className="mt-3 max-w-prose whitespace-pre-line wrap-break-word text-[15px] leading-7 text-muted-foreground">
						{faq.answer}
					</p>
				</section>
			</div>

			{/* Actions */}
			<footer className="flex items-center gap-2 px-5 py-10 sm:px-7">
				<Button type="button" onClick={onEdit} className={"flex gap-2"}>
					<Pencil className="size-4" />
					<Link to="/admin/faqs/edit/$id" params={{ id: faq.id }}>
						Edit
					</Link>
				</Button>

				<Button
					type="button"
					variant="destructive"
					onClick={() => void handleDelete()}
				>
					<Trash2 className="size-4" />
					{deleting ? "Deleting..." : "Delete"}
				</Button>
			</footer>
		</div>
	);
}

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="text-sm font-medium text-muted-foreground">{children}</p>
	);
}
