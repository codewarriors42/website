import type { ReactNode } from "react";

type ListItemsProps<T> = {
	data: T[];
	isPending: boolean;
	error: unknown;
	/** Shown in the error message, e.g. "FAQs" */
	label: string;
	emptyText?: string;
	renderItem: (item: T) => ReactNode;
};

export function ListItems<T extends { id: string }>({
	data,
	isPending,
	error,
	label,
	emptyText = "Nothing here yet.",
	renderItem,
}: ListItemsProps<T>) {
	if (isPending) {
		return <p className="px-3 py-4 text-sm text-muted-foreground">Loading…</p>;
	}

	if (error) {
		return (
			<p className="px-3 py-4 text-sm text-destructive">
				{error instanceof Error ? error.message : `Unable to load ${label}.`}
			</p>
		);
	}

	if (data.length === 0) {
		return (
			<p className="rounded-xl border border-dashed border-border px-3 py-5 text-center text-sm text-muted-foreground">
				{emptyText}
			</p>
		);
	}

	return (
		<ul className="space-y-1">
			{data.map((item) => (
				<li key={item.id}>{renderItem(item)}</li>
			))}
		</ul>
	);
}
