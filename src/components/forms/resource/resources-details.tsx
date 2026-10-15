import {
	Check,
	Copy,
	ExternalLink,
	Globe,
	Image as ImageIcon,
	Link2,
	Moon,
	Pencil,
	Sun,
	Trash2,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";
import type { ResourceTypeWithId } from "#/server/db/schema/resource.db.type.ts";
import { Link } from "@tanstack/react-router";

interface ResourceDetailsProps {
	resource: ResourceTypeWithId;
	onEdit: () => void;
	onDelete: () => void | Promise<void>;
}

function safeHref(url: string) {
	try {
		const { protocol } = new URL(url.trim());
		return protocol === "http:" || protocol === "https:" ? url.trim() : null;
	} catch {
		return null;
	}
}

function getDomain(url: string) {
	try {
		return new URL(url.trim()).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}

export function ResourceDetails({
	resource,
	onEdit,
	onDelete,
}: ResourceDetailsProps) {
	const [copied, setCopied] = useState(false);
	const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	const href = safeHref(resource.link);
	const domain = getDomain(resource.link);

	useEffect(() => () => clearTimeout(copyTimer.current), []);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(resource.link);
			setCopied(true);
			clearTimeout(copyTimer.current);
			copyTimer.current = setTimeout(() => setCopied(false), 1800);
		} catch {
			// clipboard can be blocked (e.g. on http pages): nothing to do
		}
	}

	async function handleDelete() {
		try {
			await onDelete();
		} finally {
			// nothing to do
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col text-foreground">
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-8">
				{/* Header */}
				<header className="flex flex-wrap items-start justify-between gap-4">
					<div className="min-w-0">
						<h2 className="text-balance wrap-break-word text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
							{resource.name}
						</h2>
						{domain && (
							<p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
								<Globe className="size-4 shrink-0" strokeWidth={1.8} />
								<span className="min-w-0 truncate">{domain}</span>
							</p>
						)}
					</div>

					{href ? (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
						>
							<ExternalLink className="size-4" />
							Open
						</a>
					) : null}
				</header>

				{/* Appearance */}
				<section className="mt-8">
					<Eyebrow>Appearance</Eyebrow>
					<div className="mt-3 grid gap-3 sm:grid-cols-2">
						<ThemeTile
							surface="dark"
							image={resource.dark}
							name={resource.name}
						/>
						<ThemeTile
							surface="light"
							image={resource.light}
							name={resource.name}
						/>
					</div>
					<p className="mt-2 text-xs text-muted-foreground">
						Each image is shown on the background it is meant for.
					</p>
				</section>

				{/* Link */}
				<section className="mt-8">
					<Eyebrow>Link</Eyebrow>
					<div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-muted/30 py-2 pl-3 pr-2">
						<Link2
							className="size-4 shrink-0 text-muted-foreground"
							strokeWidth={1.8}
						/>
						<span
							className="min-w-0 flex-1 truncate text-sm"
							title={resource.link}
						>
							{resource.link}
						</span>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={handleCopy}
							aria-label={copied ? "Link copied" : "Copy link"}
							title={copied ? "Copied" : "Copy link"}
							className="size-8 shrink-0 text-muted-foreground"
						>
							{copied ? (
								<Check className="size-4" />
							) : (
								<Copy className="size-4" />
							)}
						</Button>
					</div>
					{!href && (
						<p className="mt-2 text-xs text-destructive">
							This link isn't a valid http(s) address, so it can't be opened.
						</p>
					)}
				</section>
			</div>

			{/* Actions */}
			<footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border px-4 py-4 sm:px-7">
				<Link to="/admin/resources/edit/$id" params={{ id: resource.id }}>
					<Button type="button" onClick={onEdit}>
						<Pencil className="size-4" />
						Edit
					</Button>
				</Link>
				<Button
					type="button"
					variant="outline"
					onClick={() => void handleDelete()}
					className="flex-1 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive sm:flex-none"
				>
					<Trash2 className="size-4" />
					Delete
				</Button>
			</footer>
		</div>
	);
}

/* ------------------------------- Small pieces ------------------------------- */

/**
 * One theme image drawn on the background it is meant for.
 * The tile stays dark or white on purpose, whatever the admin theme is.
 */
function ThemeTile({
	surface,
	image,
	name,
}: {
	surface: "dark" | "light";
	image: ResourceTypeWithId["dark"];
	name: string;
}) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);

	// `image` can be a File while editing; only a saved URL string can be shown here
	const src = typeof image === "string" ? image : "";
	const showImage = !!src && failedSrc !== src;
	const isDark = surface === "dark";

	return (
		<div
			className={cn(
				"relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-border px-6 pb-10 pt-6",
				isDark ? "bg-zinc-950" : "bg-white",
			)}
		>
			{showImage ? (
				<img
					src={src}
					alt={`${name} logo for ${surface} mode`}
					onError={() => setFailedSrc(src)}
					className="max-h-full max-w-full object-contain"
				/>
			) : (
				<div
					className={cn(
						"flex flex-col items-center gap-1 text-xs",
						isDark ? "text-zinc-500" : "text-zinc-400",
					)}
				>
					<ImageIcon className="size-6" strokeWidth={1.4} />
					No image
				</div>
			)}

			<span
				className={cn(
					"absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
					isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600",
				)}
			>
				{isDark ? <Moon className="size-3" /> : <Sun className="size-3" />}
				{isDark ? "Dark mode" : "Light mode"}
			</span>
		</div>
	);
}

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="text-sm font-medium text-muted-foreground">{children}</p>
	);
}
