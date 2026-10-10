import mongoose from "mongoose";
import { modules } from "../models/index.js";
import {
  projects,
  articles,
  team,
  positions,
} from "../../../shared/content.js";
await mongoose.connect(process.env.MONGODB_URI);
for (const [key, items] of Object.entries({
  projects,
  articles,
  team,
  positions,
}))
  for (const item of items)
    await modules[key].updateOne(
      key === "team" ? { name: item.name } : { slug: item.slug },
      { $setOnInsert: item },
      { upsert: true },
    );
console.log("Demo content seeded without overwriting existing records.");
await mongoose.disconnect();
