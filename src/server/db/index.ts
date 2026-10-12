import mongoose from "mongoose";

const databaseUrl = process.env.DB_URL;
if (!databaseUrl) throw new Error("DB_URL is not set");

const g = globalThis as unknown as {
	__mongoose?: { promise: Promise<typeof mongoose> | null };
};
const existingCache = g.__mongoose;
const cache = existingCache ?? { promise: null };
if (!existingCache) g.__mongoose = cache;

export function connectDB(): Promise<typeof mongoose> {
	if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);

	cache.promise ??= mongoose
		.connect(databaseUrl, {
			serverSelectionTimeoutMS: 5000,
		})
		.catch((err) => {
			cache.promise = null; // allow a retry on the next request
			throw err;
		});

	return cache.promise;
}

mongoose.connection.on("error", (err) =>
	console.error("[mongo] connection error:", err),
);
mongoose.connection.on("disconnected", () =>
	console.warn("[mongo] disconnected"),
);
