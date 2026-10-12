import type { Model } from "mongoose";
import mongoose, { Schema, model } from "mongoose";
import type { MemberType } from "./member.db.type.ts";

const MemberSchema = new Schema<MemberType>(
	{
		name: { type: String, required: true },
		grade: { type: Number, required: true },
		roles: {
			type: [String],
			required: true,
		},
		socials: [
			{
				_id: false,
				platform: { type: String, required: true },
				URL: { type: String, required: true },
			},
		],
		image: { type: String, required: false },
	},
	{ timestamps: true },
);

export const MemberModel =
	typeof mongoose.models.Member !== "undefined"
		? (mongoose.models.Member as Model<MemberType>)
		: model<MemberType>("Member", MemberSchema);
