import { Image as ImageIcon } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import type { ArchiveTypeWithId } from "#/server/db/schema/archive.db.type.ts";
import { Link } from "@tanstack/react-router";
import { SocialLinks } from "#/components/social-links.tsx";
import { useState } from "react";
import { AddContributors } from "#/components/add-contributers.tsx";
import { TrophyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "#/components/ui/badge.tsx";
import { useImageUrl } from "#/hooks/use-file-url.tsx";
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
	const [deleting, setDeleting] = useState(false);
	const { imgUrl } = useImageUrl(archive.image as string);

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
				<div className="flex-1 overflow-y-auto mask-b-from-95% scroll-smooth p-5">
					{/* Cover */}
					<div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/40 sm:aspect-10/3">
						{imgUrl ? (
							<img
								src={imgUrl}
								alt={archive.title}
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
						<h2 className="text-balance capitalize wrap-break-word text-2xl font-semibold leading-snug tracking-tight sm:text-2xl">
							{archive.title}
						</h2>
						<p className="mt-1.5 flex items-center gap-2 text-base text-muted-foreground">
							<HugeiconsIcon
								icon={TrophyIcon}
								size={23}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span className="min-w-0 wrap-break-word">
								{archive.competition}
							</span>
						</p>
						<div className="mt-4 flex flex-wrap gap-2">
							<Badge variant="secondary">{formatLabel(archive.category)}</Badge>
							<Badge variant="secondary">{formatLabel(archive.event)}</Badge>
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
				<footer className="flex items-center gap-2 p-5 md:max-w-sm">
					<Link
						to="/admin/archives/edit/$id"
						params={{ id: archive.id }}
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
