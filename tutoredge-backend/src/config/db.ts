// import mongoose from "mongoose";
// import { config } from "./env";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(config.MONGO_URI);
//     console.log("✅ MongoDB connected successfully");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed", err);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async () => {
  if (!config.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
};

