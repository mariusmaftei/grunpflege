import mongoose from "mongoose";
import { config } from "./index.js";

export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
  return mongoose.connection;
}
