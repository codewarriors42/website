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
		<div className="flex h-full overflow-hidden bg-background text-foreground">
			<div className="w-full flex flex-col justify-between">
				{/* Content */}
				<div className="flex-1 overflow-y-auto mask-b-from-95% scroll-smooth">
					{/* Question */}
					<section className="w-full border-b border-border p-5">
						<Eyebrow>Question</Eyebrow>
						<h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground">
							{faq.question}
						</h2>
					</section>

					{/* Answer */}
					<section className="p-5">
						<Eyebrow>Answer</Eyebrow>
						<p className="mt-2 max-w-prose whitespace-pre-line wrap-break-word text-base leading-7 text-muted-foreground">
							{faq.answer}
						</p>
					</section>
				</div>

				{/* Actions */}
				<footer className="flex items-center gap-2 p-5 md:max-w-sm">
					<Link
						to="/admin/faqs/edit/$id"
						params={{ id: faq.id }}
						className="flex-1 h-full"
					>
						<Button type="button" onClick={onEdit} className={"size-full"}>
							Edit
						</Button>
					</Link>

					<Button
						className="flex-1"
						type="button"
						variant="destructive"
						onClick={() => void handleDelete()}
					>
						{deleting ? "Deleting..." : "Delete"}
					</Button>
				</footer>
			</div>
		</div>
	);
}

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="text-[1rem] font-semibold text-muted-foreground">
			{children}
		</p>
	);
}
