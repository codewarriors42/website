import { createFileRoute } from "@tanstack/react-router";
import mongoose from "mongoose";
import { connectDB } from "../server/db";

const BUCKET_NAME = "fs";
let bucket: mongoose.mongo.GridFSBucket | null = null;

async function getBucket() {
	await connectDB();
	const db = mongoose.connection.db;
	if (!db) throw new Error("Database is not connected");
	bucket ??= new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET_NAME });
	return bucket;
}

const TYPE_BY_EXTENSION: Record<string, string> = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	webp: "image/webp",
	svg: "image/svg+xml",
	gif: "image/gif",
};

const OBJECT_ID = /^[a-f\d]{24}$/i;

async function openFile(key: string) {
	const bucket = await getBucket();
	const filter = OBJECT_ID.test(key)
		? { _id: new mongoose.mongo.ObjectId(key) }
		: { filename: key };
	const [info] = await bucket
		.find(filter)
		.sort({ uploadDate: -1 })
		.limit(1)
		.toArray();
	if (!info) return null;
	return { info, stream: bucket.openDownloadStream(info._id) };
}

async function deleteFile(fileId: string) {
	const bucket = await getBucket();
	const [file] = await bucket.find({ filename: fileId }).limit(1).toArray();
	if (!file) {
		return new Response("File not found", { status: 404 });
	}
	await bucket.delete(file._id);
}

export const Route = createFileRoute("/api/file")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const fileId = new URL(request.url).searchParams.get("fileId");
					if (!fileId)
						return new Response("Missing fileId parameter", { status: 400 });

					const file = await openFile(fileId);
					if (!file) {
						return new Response("File not found", { status: 404 });
					}
					const { info, stream } = file;

					const ext = (info.filename?.split(".").pop() ?? "").toLowerCase();
					const metadata = info.metadata as
						| { contentType?: string; mimeType?: string }
						| undefined;

					const contentType =
						metadata?.contentType ||
						metadata?.mimeType ||
						TYPE_BY_EXTENSION[ext] ||
						"application/octet-stream";

					const chunks: Buffer[] = [];
					for await (const chunk of stream) chunks.push(chunk as Buffer);
					const body = Buffer.concat(chunks);

					return new Response(new Uint8Array(body), {
						headers: {
							"Content-Type": contentType,
							"Content-Length": String(body.length),
							"Cache-Control":
								process.env.NODE_ENV !== "production"
									? "no-store"
									: OBJECT_ID.test(fileId)
										? "public, max-age=31536000, immutable"
										: "public, max-age=3600",
							"X-Content-Type-Options": "nosniff",
						},
					});
				} catch (e) {
					console.error("[api/file] error", e);
					return new Response("Internal error", { status: 500 });
				}
			},
			POST: async ({ request }) => {
				try {
					const formData = await request.formData();
					const file = formData.get("file") as File | null;
					if (!file) return new Response("Missing file", { status: 400 });
					const filename = `avatar-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
					console.log("[api/file] POST", {
						filename,
						size: file.size,
						type: file.type,
					});
					const bucket = await getBucket();
					``;
					const uploadStream = bucket.openUploadStream(filename, {
						metadata: { contentType: file.type, mimeType: file.type },
					});
					const arrayBuffer = await file.arrayBuffer();
					uploadStream.end(Buffer.from(arrayBuffer));

					uploadStream.on("finish", () => {
						console.log("[api/file] uploaded", {
							filename,
							fileId: uploadStream.id,
						});
					});

					return new Response(JSON.stringify({ filename }), {
						headers: { "Content-Type": "application/json" },
					});
				} catch (e) {
					console.error("[api/file] POST error", e);
					return new Response("Internal error", { status: 500 });
				}
			},
			DELETE: async ({ request }) => {
				try {
					const fileId = new URL(request.url).searchParams.get("fileId");
					if (!fileId) {
						return new Response("Missing fileId parameter", {
							status: 400,
						});
					}
					await deleteFile(fileId);
					return new Response(null, { status: 204 });
				} catch (e) {
					console.error("[api/file] DELETE error", e);
					return new Response("Internal error", { status: 500 });
				}
			},
		},
	},
});
