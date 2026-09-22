import buildApp from "./app";
import { connectDB } from "./config/db";
import { config } from "./config/env";
import cookie from "@fastify/cookie";
const start = async () => {
  try {
    // Connect DB
    await connectDB();

    // Build Fastify app
    const app = await buildApp();
    console.log("🔥 ACTUAL MONGO URI:", process.env.MONGO_URI);
    
    app.register(cookie);

    // Wait for app to be ready
    await app.ready();
    console.log(`\n✅ All routes registered successfully`);
    console.log(`📋 Check routes at: http://localhost:${config.PORT}/api/v1/health`);

    // Start server
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    console.log(`📚 Swagger docs available at http://localhost:${config.PORT}/docs`);
    console.log(`🏥 Health check: http://localhost:${config.PORT}/api/v1/health`);
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

start();
