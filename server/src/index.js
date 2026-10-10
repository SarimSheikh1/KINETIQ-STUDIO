import mongoose from "mongoose";
import { createApp } from "./app.js";
if (!process.env.MONGODB_URI)
  throw new Error("Set MONGODB_URI in .env before starting the server.");
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});
const server = createApp().listen(Number(process.env.PORT) || 4000, () =>
  console.log("KINETIQ API listening"),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    }),
  );
