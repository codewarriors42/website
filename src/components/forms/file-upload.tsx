import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MAX_PHOTO_MB = 5;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const validatePhoto = (file: File): string | null => {
	if (!PHOTO_TYPES.includes(file.type)) return "Use a JPG, PNG or WebP image.";
	if (file.size > MAX_PHOTO_MB * 1024 * 1024)
		return `Image must be under ${MAX_PHOTO_MB} MB.`;
	return null;
};

export const initials = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");

export function PhotoUpload({
	file,
	savedUrl,
	name,
	onPick,
	onRemove,
}: {
	file: File | null;
	savedUrl: string;
	name: string;
	onPick: (file: File) => void;
	onRemove: () => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Create a temporary preview for the picked file and free it afterwards.
	useEffect(() => {
		if (!file) {
			setPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const src = previewUrl ?? (savedUrl || undefined);
	const hasPhoto = !!file || !!savedUrl;

	return (
		<div className="flex item-center gap-3">
			<Avatar className="size-20">
				<AvatarImage src={src} alt="Photo preview" className="object-cover" />
				<AvatarFallback className="text-xl font-semibold">
					{initials(name) || "?"}
				</AvatarFallback>
			</Avatar>

			<div className="flex flex-wrap items-center gap-2">
				<input
					ref={inputRef}
					type="file"
					accept={PHOTO_TYPES.join(",")}
					className="sr-only"
					tabIndex={-1}
					aria-label="Upload profile photo"
					onChange={(e) => {
						const picked = e.target.files?.[0];
						if (picked) onPick(picked);
						e.target.value = ""; // allow picking the same file again
					}}
				/>
				<div className="flex flex-col gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => inputRef.current?.click()}
					>
						{hasPhoto ? "Change photo" : "Upload photo"}
					</Button>
					{hasPhoto && (
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={onRemove}
						>
							Remove
						</Button>
					)}
					{/* {file && (
						<span className="max-w-48 truncate text-xs text-muted-foreground">
							{file.name}
						</span>
					)} */}
				</div>
			</div>
		</div>
	);
}
