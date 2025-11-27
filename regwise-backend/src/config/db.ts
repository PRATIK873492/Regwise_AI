import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function connectDB(mongoUri?: string) {
  let lastError: any = null;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to", mongoUri);
      });
      mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
      });
      return;
    } catch (err) {
      console.warn("Failed to connect to provided MONGO_URI:", err);
      lastError = err;
    }
  }

  // If no URI provided or connecting failed, start an in-memory MongoDB for development
  try {
    console.warn("Starting in-memory MongoDB for development");
    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to in-memory MongoDB at", memoryUri);
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error (in-memory):", err);
    });
  } catch (err) {
    console.error("Failed to connect to in-memory MongoDB:", err);
    throw lastError || err;
  }
}
