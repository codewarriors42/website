import type { Model } from "mongoose";
import mongoose, { Schema, model } from "mongoose";
import type { AdminUserType } from "./user.db.type";

const UserSchema = new Schema<AdminUserType>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		isSupreme: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true },
);

export const UserModel =
	typeof mongoose.models.User !== "undefined"
		? (mongoose.models.User as Model<AdminUserType>)
		: model<AdminUserType>("User", UserSchema);
