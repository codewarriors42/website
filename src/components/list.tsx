import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Input } from "#/components/ui/input.tsx";
import { useListSearch } from "#/hooks/search.tsx";
import { cn } from "#/lib/utils.ts";
import { ListItems } from "./list-items.tsx";
import { SearchSheet } from "./search-sheet.tsx";

type ListProps<T> = {
	data: T[] | undefined;
	isPending: boolean;
	error: unknown;
	pathname: string;

	/** Plural name, e.g. "FAQs" */
	label: string;
	/** Singular name, e.g. "FAQ" */
	singular: string;
	/** Route of the "add" page, e.g. "/admin/faqs/add" */
	addTo: string;
	/** Where Cancel goes while adding or editing, e.g. "/admin/faqs" */
	cancelTo: string;

	/** Fields to search. Define it OUTSIDE the component so it stays stable. */
	getText: (item: T) => (string | number)[];
	/** Render ONE link. `close` is only passed inside the phone search sheet. */
	renderItem: (item: T, close?: () => void) => ReactNode;
};

export function List<T extends { id: string }>({
	data,
	isPending,
	error,
	pathname,
	label,
	singular,
	addTo,
	cancelTo,
	getText,
	renderItem,
}: ListProps<T>) {
	const navigate = useNavigate();
	const { search, setSearch, query, results } = useListSearch(data, getText);

	const isAdding = pathname.endsWith("/add");
	const isEditing = isAdding || pathname.includes("/edit/");

	const searchTitle = `Search ${label}`;

	return (
		<aside className="flex min-h-0 flex-col overflow-hidden border border-border p-4 lg:p-5">
			{isEditing ? (
				<header className="flex items-center justify-between gap-3 lg:pb-4">
					<h2 className="text-xl font-semibold">
						{isAdding ? `Add ${singular}` : `Edit ${singular}`}
					</h2>

					<Button
						type="button"
						variant="outline"
						className="shrink-0"
						onClick={() => navigate({ to: cancelTo as never })}
					>
						Cancel
					</Button>
				</header>
			) : (
				<header className="flex items-center justify-between gap-3 lg:pb-4">
					<div>
						<h2 className="font-semibold">
							{label}
							<Badge variant="secondary" className="ml-2 text-xs">
								{data?.length ?? 0}
							</Badge>
						</h2>
						<p className="text-xs text-muted-foreground">Directory</p>
					</div>

					<div className="flex items-center gap-2">
						<Link
							to={addTo as never}
							aria-label={`Add ${singular}`}
							title={`Add ${singular}`}
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"size-8 p-0",
							)}
						>
							<Plus className="size-4" />
						</Link>

						<SearchSheet
							title={searchTitle}
							placeholder={`${searchTitle}…`}
							data={data}
							getText={getText}
							getId={(item) => item.id}
							isPending={isPending}
							error={error}
							renderItem={(item, close) => renderItem(item, close)}
						/>
					</div>
				</header>
			)}

			{/* Desktop search */}
			<div className="hidden pb-3 lg:block">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search} // raw text, so spaces and capitals work
						onChange={(event) => setSearch(event.target.value)}
						placeholder={`${searchTitle}…`}
						aria-label={searchTitle}
						className="h-10 pl-9"
					/>
				</div>

				{query && !isPending && !error && (
					<p className="pt-3 text-xs text-muted-foreground">
						{results.length} of {data?.length ?? 0} {label}
					</p>
				)}
			</div>

			{/* Desktop list */}
			<div className="hidden min-h-0 flex-1 overflow-y-auto pr-1 lg:block">
				<ListItems
					data={results}
					isPending={isPending}
					error={error}
					label={label}
					emptyText={
						query ? `No ${label} match "${search.trim()}".` : `No ${label} yet.`
					}
					renderItem={(item) => renderItem(item)}
				/>
			</div>
		</aside>
	);
}
