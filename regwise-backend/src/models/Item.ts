import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description?: string;
  meta?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", ItemSchema);
