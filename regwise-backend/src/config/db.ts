import mongoose from "mongoose";

export async function connectDB(mongoUri: string) {
  await mongoose.connect(mongoUri);
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to", mongoUri);
  });
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });
}
