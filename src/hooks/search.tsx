import { useDeferredValue, useMemo, useState } from "react";

import type { AlumniWithId } from "#/server/db/schema/alumni.db.type.ts";
import type { FaqTypeWithId } from "#/server/db/schema/faq.db.type.ts";
import type { MemberWithId } from "#/server/db/schema/member.db.type.ts";
import type { ArchiveTypeWithId } from "#/server/db/schema/archive.db.type.ts";

const EMPTY: never[] = [];

const normalize = (value: string) =>
	value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * Generic search for any list.
 * `getText` returns the fields to search. Define it OUTSIDE components so its identity is stable.
 */
export function useListSearch<T>(
	data: T[] | undefined,
	getText: (item: T) => (string | number)[],
) {
	const [search, setSearch] = useState("");

	const deferredSearch = useDeferredValue(search);
	const query = normalize(deferredSearch);

	const index = useMemo(
		() =>
			(data ?? EMPTY).map((item) => ({
				item,
				text: normalize(getText(item).join(" ")),
			})),
		[data, getText],
	);

	const results = useMemo(() => {
		if (!query) return (data ?? EMPTY) as T[];
		const terms = query.split(" ");
		return index
			.filter((entry) => terms.every((term) => entry.text.includes(term)))
			.map((entry) => entry.item);
	}, [index, query, data]);

	return {
		search, // what the user typed: bind the input to this
		setSearch,
		query, // cleaned version: use for "is filtering?" checks and counts
		results, // same type as the input list
	};
}

/* ------------------------- Ready-made list searches ------------------------- */

export const faqText = (f: FaqTypeWithId) => [f.question, f.answer];
export const memberText = (m: MemberWithId) => [m.name, ...(m.roles ?? [])];
export const alumniText = (a: AlumniWithId) => [
	a.name,
	...(a.roles ?? []),
	a.year,
];
export const archiveText = (a: ArchiveTypeWithId) => [
	a.title,
	a.event,
	a.category,
];
