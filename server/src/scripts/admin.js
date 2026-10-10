import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { AdminUser } from "../models/index.js";
const input = createInterface({ input: process.stdin, output: process.stdout });
const email = (await input.question("Administrator email: "))
  .trim()
  .toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  throw new Error("Enter a valid email.");
console.log(
  "Set ADMIN_PASSWORD in your current terminal environment before running this command.",
);
const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 14)
  throw new Error("ADMIN_PASSWORD must have at least 14 characters.");
await mongoose.connect(process.env.MONGODB_URI);
if (await AdminUser.exists({ email }))
  throw new Error("Administrator already exists; no password was changed.");
await AdminUser.create({
  email,
  passwordHash: await bcrypt.hash(password, 12),
  role: "admin",
});
console.log(
  "Administrator created. Clear ADMIN_PASSWORD from your terminal environment.",
);
input.close();
await mongoose.disconnect();
