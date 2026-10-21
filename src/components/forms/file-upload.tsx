import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/svg+xml",
];

export function validatePhoto(file: File): string | null {
	if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
		return "Please select a JPG, PNG, or WebP image.";
	}

	if (file.size > MAX_PHOTO_SIZE) {
		return "Image size must not exceed 5 MB.";
	}

	if (file.size === 0) {
		return "The selected image is empty.";
	}

	return null;
}

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
}: {
	file: File | null;
	savedUrl: string;
	name: string;
	onPick: (file: File) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
					accept={ALLOWED_PHOTO_TYPES.join(",")}
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
					{/* {hasPhoto && (
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={onRemove}
						>
							Remove
						</Button>
					)} */}
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
