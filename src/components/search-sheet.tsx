import { type ReactNode, useEffect, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet.tsx";
import { useListSearch } from "#/hooks/search.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

type SearchSheetProps<T> = {
	data: T[] | undefined;
	/** Which fields to search. Define it OUTSIDE the component so it stays stable. */
	getText: (item: T) => (string | number)[];
	getId: (item: T) => string;
	/** Render ONE result. Call `close()` in its onClick so the sheet closes after choosing. */
	renderItem: (item: T, close: () => void) => ReactNode;
	title: string;
	placeholder?: string;
	description?: string;
	isPending: boolean;
	error: unknown;
};

export function SearchSheet<T>({
	data,
	getText,
	getId,
	renderItem,
	title,
	placeholder = "Search…",
	description = "Search, then pick an item to open it.",
	isPending,
	error,
}: SearchSheetProps<T>) {
	const [open, setOpen] = useState(false);
	const { search, setSearch, query, results } = useListSearch(data, getText);

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) setSearch(""); // start fresh next time
	}

	const close = () => handleOpenChange(false);

	// If the screen grows to lg+ while open, close it (the sidebar search takes over)
	useEffect(() => {
		const media = window.matchMedia("(min-width: 1024px)");
		const onChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				setOpen(false);
				setSearch("");
			}
		};
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [setSearch]);

	let content: ReactNode;
	if (isPending) {
		content = (
			<p className="px-3 py-4 text-sm text-muted-foreground">Loading…</p>
		);
	} else if (error) {
		content = (
			<p className="px-3 py-4 text-sm text-destructive">
				{error instanceof Error ? error.message : "Unable to load results."}
			</p>
		);
	} else if (results.length === 0) {
		content = (
			<p className="rounded-xl border border-dashed border-border px-3 py-5 text-center text-sm text-muted-foreground">
				{query ? `No results match "${search.trim()}".` : "Nothing here yet."}
			</p>
		);
	} else {
		content = (
			<ul className="space-y-1">
				{results.map((item) => (
					<li key={getId(item)}>{renderItem(item, close)}</li>
				))}
			</ul>
		);
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetTrigger
				render={
					<Button
						variant="outline"
						size="lg"
						className="size-10 p-0 lg:hidden"
						aria-label={title}
						title={title}
					>
						<HugeiconsIcon
							icon={Search01Icon}
							size={25}
							color="currentColor"
							strokeWidth={2}
						/>
					</Button>
				}
			/>

			<SheetContent
				side="left"
				className="flex w-full! max-w-none! flex-col gap-0 p-0"
			>
				<SheetHeader className="border-b border-border p-4">
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>{description}</SheetDescription>
				</SheetHeader>

				<div className="px-4 pt-4">
					<div className="relative">
						<HugeiconsIcon
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							icon={Search01Icon}
							size={20}
							color="currentColor"
							strokeWidth={2}
						/>
						<Input
							autoFocus
							value={search} // the raw text, so spaces and capitals work
							onChange={(event) => setSearch(event.target.value)}
							placeholder={placeholder}
							aria-label={title}
							className="h-10 pl-10"
						/>
					</div>

					{query && !isPending && !error && (
						<p className="pt-3 text-xs text-muted-foreground">
							{results.length} of {data?.length ?? 0} results
						</p>
					)}
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto px-5 mt-3">
					{content}
				</div>
			</SheetContent>
		</Sheet>
	);
}
