import { ExternalLink, Image as ImageIcon, Link2, Pencil, Trash2, Trophy } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";
import { ARCHIVE_PLATFORMS, type ArchiveType } from "#/server/db/schema/archive.db.type.ts";
import { Badge } from "#/components/ui/badge.tsx";

interface ArchiveDetailsProps {
    archive: ArchiveType;
    onEdit: () => void;
    onDelete: () => void | Promise<void>;
}

/* -------------------------------- Helpers -------------------------------- */

/** "annual_fest" -> "Annual fest" */
const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");

export function ArchiveDetails({ archive, onEdit, onDelete }: ArchiveDetailsProps) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    const showImage = !!archive.image && failedSrc !== archive.image;

    async function handleDelete() {
        setDeleting(true);
        try {
            await onDelete();
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                {/* Cover */}
                <div className="relative aspect-10/3 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {showImage ? (
                        <img
                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROfzoPNUx7UPFpwKkzTmDCom9bErAzV-hxK6AxFncUiXBdqmOMobiYvjrR&s=10"}
                            alt={archive.title}
                            // onError={() => setFailedSrc(archive.image)}
                            className="size-full object-cover"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center text-zinc-600">
                            <ImageIcon className="size-9" strokeWidth={1.4} />
                        </div>
                    )}
                    <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium tabular-nums text-zinc-100 backdrop-blur">
                        {archive.year}
                    </span>
                </div>

                {/* Title */}
                <header className="mt-6">
                    <h2 className="text-balance wrap-break-word text-2xl font-semibold leading-snug tracking-tight text-zinc-100">
                        {archive.title}
                    </h2>
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-zinc-400">
                        <Trophy className="size-4 shrink-0 text-zinc-500" strokeWidth={1.8} />
                        <span className="min-w-0 wrap-break-word">{archive.competition}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-md bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-400/20">
                            {archive.category}
                        </span>
                        <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/5">
                            {archive.event}
                        </span>
                    </div>
                </header>

                {/* Contributors */}
                <section className="mt-9">
                    <Eyebrow>Contributors</Eyebrow>
                    {typeof archive.contributors === "string" ? (
                        <div className="flex items-center gap-2">
                            {archive.contributors.split(",").map((contributor, index) => (
                                <span key={index} className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/5">
                                    {formatLabel(contributor.trim())}
                                </span>
                            ))}
                        </div>
) : (
                        <p className="mt-3 text-sm text-zinc-500">No contributors listed.</p>
                    )}
                </section>

                {/* Links */}
                <section className="mt-5">
                    <p className="text-sm font-medium text-zinc-400">Socials</p>
                    {archive.links.length > 0 ? (
                        <ul className="mt-3 grid grid-cols-2 overflow-clip rounded-lg border border-white/10">
                            {archive.links.map((social) => {
                                const Icon = ExternalLink;
                                const content = (
                                    <>
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
                                            <Icon className="size-4" />
                                        </span>
                                        <span className="text-sm font-medium text-zinc-200">
                                            {formatLabel(social.platform)}
                                        </span>
                                        <span className="ml-auto min-w-0 truncate text-sm text-zinc-500">
                                            {social.URL}
                                        </span>
                                        <ExternalLink className="size-4 shrink-0 text-zinc-600" />
                                    </>
                                );

                                return (
                                    <li key={social.platform}>
                                        <a
                                            href={social.URL}
                                            target={
                                                "_blank"
                                            }
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 px-5 py-2 hover:bg-white/5"
                                        >
                                            {content}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="mt-3 text-sm text-zinc-500">No links added.</p>
                    )}
                </section>
            </div>

            {/* Actions */}
            <footer className="flex shrink-0 items-center gap-2 border-t border-white/10 px-5 py-4 sm:px-7">
                {confirming ? (
                    <>
                        <p className="mr-auto min-w-0 truncate text-sm text-zinc-400">
                            Delete this archive? This can't be undone.
                        </p>
                        <Button type="button" variant="ghost" disabled={deleting} onClick={() => setConfirming(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete}>
                            {deleting ? "Deleting…" : "Delete"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="button" onClick={onEdit}>
                            <Pencil className="size-4" />
                            Edit archive
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirming(true)}
                            className="border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
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

function Eyebrow({ children }: { children: ReactNode }) {
    return <p className="text-sm font-medium text-zinc-500">{children}</p>;
}