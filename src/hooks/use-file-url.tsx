import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Options = {
	fetchFile?: boolean;
};

export function useImageUrl(
	image?: string | null,
	{ fetchFile = true }: Options = {},
) {
	const {
		data: blob,
		isPending,
		error,
	} = useQuery({
		queryKey: ["image-file", image],
		enabled: fetchFile && !!image,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 10 * 60 * 1000,
		retry: 1,
		queryFn: async ({ signal }) => {
			if (!image) return null;
			const response = await fetch(`/api/file?fileId=${image}`, { signal });
			if (!response.ok)
				throw new Error(`Image request failed (${response.status})`);
			return response.blob();
		},
	});

	const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
	useEffect(() => {
		if (!blob) {
			setBlobUrl(undefined);
			return;
		}
		const objectUrl = URL.createObjectURL(blob);
		setBlobUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [blob]);

	if (!fetchFile || !image) {
		return { imgUrl: image ?? undefined, isImgLoading: false, ImgErorr: null };
	}
	return { imgUrl: blobUrl, isImgLoading: isPending, ImgErorr: error };
}

export function useFileUpload() {
	const { mutateAsync, isPending, error } = useMutation({
		mutationKey: ["file-upload-url"],
		mutationFn: async (file: File) => {
			if (!file) return null;
			const formData = new FormData();
			formData.append("file", file);
			const response = await fetch("/api/file", {
				method: "POST",
				body: formData,
			});
			if (!response.ok)
				throw new Error(`File upload failed (${response.status})`);
			const data = (await response.json()) as { filename: string };
			return data.filename as string;
		},
	});
	return {
		uploadFile: mutateAsync,
		isUploading: isPending,
		uploadError: error,
	};
}

export function useFileDelete() {
	const { mutateAsync, isPending, error } = useMutation({
		mutationKey: ["file-delete"],
		mutationFn: async (fileId: string) => {
			if (!fileId) return null;
			const response = await fetch(`/api/file?fileId=${fileId}`, {
				method: "DELETE",
			});
			if (!response.ok)
				throw new Error(`File delete failed (${response.status})`);
			return true;
		},
	});
	return { deleteFile: mutateAsync, isDeleting: isPending, deleteError: error };
}
