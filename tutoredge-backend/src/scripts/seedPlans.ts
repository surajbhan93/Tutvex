import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import subscriptionService from "../services/subscription.service";

async function seedPlans() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connected to MongoDB");

    console.log("🌱 Seeding subscription plans...");
    await subscriptionService.seedDefaultPlans();
    console.log("✅ Plans seeded successfully!");

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    process.exit(1);
  }
}

seedPlans();
