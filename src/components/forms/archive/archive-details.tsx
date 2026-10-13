import { Image as ImageIcon, Pencil, Trash2, Trophy } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import type { ArchiveTypeWithId } from "#/server/db/schema/archive.db.type.ts";
import { Link } from "@tanstack/react-router";
import { SocialLinks } from "#/components/social-links.tsx";
import { useState } from "react";
import { AddContributors } from "#/components/add-contributers.tsx";
interface ArchiveDetailsProps {
	archive: ArchiveTypeWithId;
	onEdit: () => void;
	onDelete: () => void | Promise<void>;
}

const formatLabel = (value: string) => {
	const text = value.replace(/[-_]+/g, " ");
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export function ArchiveDetails({
	archive,
	onEdit,
	onDelete,
}: ArchiveDetailsProps) {
	const [confirming, setConfirming] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [failedSrc, setFailedSrc] = useState<string | null>(null);

	const imageUrl = typeof archive.image === "string" ? archive.image : "";
	const showImage = !!imageUrl && failedSrc !== imageUrl;

	async function handleDelete() {
		setDeleting(true);
		try {
			await onDelete();
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col text-foreground">
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
				{/* Cover */}
				<div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/40 sm:aspect-10/3">
					{showImage ? (
						<img
							src={imageUrl}
							alt={archive.title}
							onError={() => setFailedSrc(imageUrl)}
							className="size-full object-cover"
						/>
					) : (
						<div className="flex size-full items-center justify-center text-muted-foreground/50">
							<ImageIcon className="size-9" strokeWidth={1.4} />
						</div>
					)}
					<span className="absolute bottom-3 left-3 rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur">
						{archive.year}
					</span>
				</div>

				{/* Title */}
				<header className="mt-6">
					<h2 className="text-balance wrap-break-word text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
						{archive.title}
					</h2>
					<p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
						<Trophy className="size-4 shrink-0" strokeWidth={1.8} />
						<span className="min-w-0 wrap-break-word">
							{archive.competition}
						</span>
					</p>
					<div className="mt-4 flex flex-wrap gap-2">
						<span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
							{formatLabel(archive.category)}
						</span>
						<span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground ring-1 ring-inset ring-border">
							{formatLabel(archive.event)}
						</span>
					</div>
				</header>

				{/* Contributors */}
				<section className="mt-8">
					<p className="mb-2 text-sm text-muted-foreground">Contributors</p>
					<AddContributors
						contributors={archive.contributors}
						setContributors={() => undefined}
						readonly={true}
					/>
				</section>

				{/* Links */}
				<section className="mt-8">
					<p className="mb-2 text-sm text-muted-foreground">Links</p>
					<div>
						<SocialLinks socials={archive.links} />
					</div>
				</section>
			</div>

			{/* Actions */}
			<footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border px-4 py-4 sm:px-7">
				{confirming ? (
					<>
						<p className="basis-full text-sm text-muted-foreground sm:mr-auto sm:basis-auto">
							Delete this archive? This can't be undone.
						</p>
						<Button
							type="button"
							variant="ghost"
							disabled={deleting}
							onClick={() => setConfirming(false)}
							className="flex-1 sm:flex-none"
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={deleting}
							onClick={handleDelete}
							className="flex-1 sm:flex-none"
						>
							{deleting ? "Deleting…" : "Delete"}
						</Button>
					</>
				) : (
					<>
						<Link to="/admin/archives/edit/$id" params={{ id: archive.id }}>
							<Button type="button" onClick={onEdit}>
								<Pencil className="size-4" />
								Edit
							</Button>
						</Link>
						<Button
							type="button"
							variant="outline"
							onClick={() => setConfirming(true)}
							className="flex-1 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive sm:flex-none"
						>
							<Trash2 className="size-4" />
							Delete
						</Button>
					</>
				)}
			</footer>
		</div>
	);
}
