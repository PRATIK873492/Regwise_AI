import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  role?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
