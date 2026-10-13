import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge.tsx";
import { Input } from "#/components/ui/input.tsx";

type AddContributorsProps = {
	id?: string;
	contributors: string | string[] | null | undefined;
	setContributors: (contributors: string[]) => void;
	readonly?: boolean;
};

export function AddContributors({
	id,
	contributors,
	setContributors,
	readonly = false,
}: AddContributorsProps) {
	const [value, setValue] = useState("");

	// Always work with an array internally.
	const contributorList: string[] = Array.isArray(contributors)
		? contributors
		: typeof contributors === "string"
			? contributors
					.split(",")
					.map((name) => name.trim())
					.filter(Boolean)
			: [];

	function add() {
		const name = value.trim();
		if (!name) return;

		const exists = contributorList.some(
			(c) => c.toLowerCase() === name.toLowerCase(),
		);

		if (!exists) {
			setContributors([...contributorList, name]);
		}

		setValue("");
	}

	function remove(name: string) {
		setContributors(contributorList.filter((c) => c !== name));
	}

	return (
		<>
			{readonly ? (
				contributorList.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No contributors added yet.
					</p>
				) : (
					<ul className="flex flex-wrap gap-1.5">
						{contributorList.map((name) => (
							<li key={name}>
								<span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
									{name}
								</span>
							</li>
						))}
					</ul>
				)
			) : (
				<div className="flex flex-wrap items-center gap-2 border p-3">
					{contributorList.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No contributors added yet.
						</p>
					) : (
						<ul className="flex flex-wrap gap-1.5">
							{contributorList.map((name) => (
								<li key={name}>
									<Badge variant="secondary" className="gap-1 pr-1">
										{name}

										<button
											type="button"
											onClick={() => remove(name)}
											aria-label={`Remove ${name}`}
											className="rounded-sm p-0.5 outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
										>
											<X className="size-3" />
										</button>
									</Badge>
								</li>
							))}
						</ul>
					)}

					<Input
						id={id}
						className="max-w-55 px-4 outline-none border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === ",") {
								e.preventDefault();
								add();
							}
						}}
						onBlur={add}
						placeholder="Enter name and press Enter"
						autoComplete="off"
					/>
				</div>
			)}
		</>
	);
}
