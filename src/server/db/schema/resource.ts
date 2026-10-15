import type { Model } from "mongoose";
import mongoose, { model, Schema } from "mongoose";
import type { ResourceType } from "./resource.db.type";

const ResourceSchema = new Schema<ResourceType>(
	{
		name: { type: String, required: true },
		link: { type: String, required: true },
		dark: { type: String, required: false },
		light: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

export const ResourceModel =
	typeof mongoose.models.Resource !== "undefined"
		? (mongoose.models.Resource as Model<ResourceType>)
		: model<ResourceType>("Resource", ResourceSchema);
