import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { rateLimit } from "express-rate-limit";
import bcrypt from "bcryptjs";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import {
  AdminUser,
  CareerPosition,
  ContactSubmission,
  CareerApplication,
  modules,
} from "./models/index.js";
import { contact, application, login, schemas } from "./validators/index.js";
const id = (value) => mongoose.isValidObjectId(value);
export function createApp({ test = false } = {}) {
  const app = express();
  const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
  if (
    !test &&
    (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
  )
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  app.disable("x-powered-by");
  if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          workerSrc: ["'self'", "blob:"],
        },
      },
    }),
  );
  app.use(cors({ origin, credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 60000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { error: "Too many requests. Please try again shortly." },
    }),
  );
  app.use(
    session({
      name: "kinetiq.sid",
      secret: test
        ? "test-secret-never-use-in-production"
        : process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      ...(!test
        ? { store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }) }
        : {}),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 8 * 60 * 60 * 1000,
      },
    }),
  );
  app.use("/api", (req, res, next) => {
    if (
      ["POST", "PATCH", "DELETE", "PUT"].includes(req.method) &&
      req.get("origin") !== origin
    )
      return res.status(403).json({ error: "Request origin rejected." });
    next();
  });
  const auth = (req, res, next) =>
    req.session.user
      ? next()
      : res.status(401).json({ error: "Please sign in." });
  const write = (req, res, next) => {
    const token = req.get("x-csrf-token") || "";
    const expected = req.session.csrf || "";
    if (
      !expected ||
      token.length !== expected.length ||
      !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    )
      return res
        .status(403)
        .json({ error: "Session verification failed. Sign in again." });
    next();
  };
  const admin = (req, res, next) =>
    req.session.user?.role === "admin"
      ? next()
      : res.status(403).json({ error: "Administrator role required." });
  const check = (schema, body) => {
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = new Error(
        result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      );
      error.status = 400;
      throw error;
    }
    return result.data;
  };
  app.get("/api/health", (_req, res) =>
    res.json({
      status:
        mongoose.connection.readyState === 1 ? "ok" : "database-unavailable",
    }),
  );
  app.get("/api/content", async (_req, res) =>
    res.json({
      projects: await modules.projects
        .find({ published: true })
        .sort({ displayOrder: 1 })
        .lean(),
      articles: await modules.articles
        .find({ status: "published" })
        .sort({ publishedAt: -1 })
        .lean(),
      team: await modules.team.find().sort({ displayOrder: 1 }).lean(),
      positions: await modules.positions.find({ status: "open" }).lean(),
    }),
  );
  const submissions = rateLimit({
    windowMs: 15 * 60000,
    limit: 5,
    message: { error: "Submission limit reached. Please try later." },
  });
  app.post("/api/contact", submissions, async (req, res) => {
    const data = check(contact, req.body);
    await ContactSubmission.create(data);
    res
      .status(201)
      .json({ message: "Your enquiry has been saved. Thank you." });
  });
  app.post("/api/applications", submissions, async (req, res) => {
    const data = check(application, req.body);
    if (!(await CareerPosition.exists({ _id: data.position, status: "open" })))
      return res
        .status(400)
        .json({ error: "This position is no longer open." });
    await CareerApplication.create(data);
    res.status(201).json({ message: "Your application has been saved." });
  });
  app.post(
    "/api/auth/login",
    rateLimit({
      windowMs: 15 * 60000,
      limit: 10,
      message: { error: "Too many login attempts. Try again later." },
    }),
    async (req, res, next) => {
      const data = check(login, req.body);
      const user = await AdminUser.findOne({ email: data.email.toLowerCase() });
      if (!user || !(await bcrypt.compare(data.password, user.passwordHash)))
        return res
          .status(401)
          .json({ error: "Email or password is incorrect." });
      req.session.regenerate((error) => {
        if (error) return next(error);
        req.session.user = { id: user.id, email: user.email, role: user.role };
        req.session.csrf = randomUUID();
        req.session.save((error) =>
          error
            ? next(error)
            : res.json({ user: req.session.user, csrf: req.session.csrf }),
        );
      });
    },
  );
  app.get("/api/auth/me", auth, (req, res) =>
    res.json({ user: req.session.user, csrf: req.session.csrf }),
  );
  app.post("/api/auth/logout", auth, write, (req, res, next) =>
    req.session.destroy((error) => {
      if (error) return next(error);
      res.clearCookie("kinetiq.sid");
      res.json({ ok: true });
    }),
  );
  app.get("/api/admin/:module", auth, async (req, res) => {
    const Model = modules[req.params.module];
    if (!Model) return res.status(404).json({ error: "Unknown module." });
    res.json(await Model.find().sort({ createdAt: -1 }).limit(1000).lean());
  });
  app.post("/api/admin/:module", auth, write, admin, async (req, res, next) => {
    const key = req.params.module;
    if (key === "media") return next();
    if (!["projects", "articles", "team", "positions"].includes(key))
      return res.status(400).json({ error: "This module is read-only." });
    res
      .status(201)
      .json(await modules[key].create(check(schemas[key], req.body)));
  });
  app.patch("/api/admin/:module/:id", auth, write, admin, async (req, res) => {
    const key = req.params.module;
    if (!modules[key] || !id(req.params.id))
      return res.status(404).json({ error: "Record not found." });
    const record = await modules[key].findByIdAndUpdate(
      req.params.id,
      check(schemas[key], req.body),
      { new: true, runValidators: true },
    );
    if (!record) return res.status(404).json({ error: "Record not found." });
    res.json(record);
  });
  app.delete("/api/admin/:module/:id", auth, write, admin, async (req, res) => {
    const key = req.params.module;
    if (
      !["projects", "articles", "team", "positions"].includes(key) ||
      !id(req.params.id)
    )
      return res.status(400).json({ error: "Cannot delete this record." });
    if (
      key === "positions" &&
      (await CareerApplication.exists({ position: req.params.id }))
    )
      return res
        .status(409)
        .json({
          error:
            "This role has applications. Close it instead to preserve records.",
        });
    if (!(await modules[key].findByIdAndDelete(req.params.id)))
      return res.status(404).json({ error: "Record not found." });
    res.json({ ok: true });
  });
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  });
  app.post(
    "/api/admin/media",
    auth,
    write,
    admin,
    upload.single("image"),
    async (req, res) => {
      if (!req.file) return res.status(400).json({ error: "Select an image." });
      const type = await fileTypeFromBuffer(req.file.buffer);
      if (
        !type ||
        !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
          type.mime,
        )
      )
        return res
          .status(400)
          .json({
            error:
              "Only verified JPEG, PNG, WebP or AVIF images are supported.",
          });
      await mkdir(uploadDir, { recursive: true });
      const name = `${randomUUID()}.${type.ext}`;
      await writeFile(path.join(uploadDir, name), req.file.buffer);
      res.status(201).json({ url: `/uploads/${name}` });
    },
  );
  app.use(
    "/uploads",
    express.static(uploadDir, {
      dotfiles: "deny",
      setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
    }),
  );
  if (!test) {
    const dist = path.resolve("../client/dist");
    app.use(express.static(dist));
    app.get("/{*path}", (req, res) =>
      req.path.startsWith("/api/")
        ? res.status(404).json({ error: "Endpoint not found." })
        : res.sendFile(path.join(dist, "index.html")),
    );
  }
  app.use((error, _req, res, _next) => {
    const status =
      error.status ||
      (error.code === 11000
        ? 409
        : error instanceof multer.MulterError
          ? 400
          : 500);
    if (status === 500) console.error(error.message);
    res
      .status(status)
      .json({
        error:
          status === 500
            ? "Server could not complete the request. Please try again."
            : error.code === 11000
              ? "This slug or email already exists."
              : error.message,
      });
  });
  return app;
}
