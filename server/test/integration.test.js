import { test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app.js";
import {
  AdminUser,
  ContactSubmission,
  CareerApplication,
} from "../src/models/index.js";
test(
  "database-backed authentication, content, submissions and upload validation",
  { skip: process.env.RUN_DB_TESTS !== "1", timeout: 240000 },
  async () => {
    const database = await MongoMemoryServer.create();
    try {
      await mongoose.connect(database.getUri());
      await AdminUser.create({
        email: "admin@example.test",
        passwordHash: await bcrypt.hash("test-password-with-14-characters", 12),
        role: "admin",
      });
      const app = createApp({ test: true });
      const origin = "http://localhost:5173";
      const agent = request.agent(app);
      let r = await agent
        .post("/api/auth/login")
        .set("Origin", origin)
        .send({ email: "admin@example.test", password: "wrong-password" });
      assert.equal(r.status, 401);
      r = await agent
        .post("/api/auth/login")
        .set("Origin", origin)
        .send({
          email: "admin@example.test",
          password: "test-password-with-14-characters",
        });
      assert.equal(r.status, 200);
      assert.match(r.headers["set-cookie"][0], /HttpOnly/);
      const csrf = r.body.csrf;
      const project = {
        title: "Test project",
        slug: "test-project",
        category: "Branding",
        summary: "Test summary",
        description: "An original test project.",
        color: "#C7B8FF",
        media: ["/images/monoform.svg"],
        featured: true,
        displayOrder: 2,
        published: true,
      };
      r = await agent
        .post("/api/admin/projects")
        .set("Origin", origin)
        .send(project);
      assert.equal(r.status, 403);
      r = await agent
        .post("/api/admin/projects")
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .send(project);
      assert.equal(r.status, 201);
      const projectId = r.body._id;
      r = await request(app).get("/api/content");
      assert.equal(r.body.projects.length, 1);
      r = await agent
        .patch("/api/admin/projects/" + projectId)
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .send({ ...project, displayOrder: 0 });
      assert.equal(r.status, 200);
      assert.equal(r.body.displayOrder, 0);
      const article = {
        title: "Test note",
        slug: "test-note",
        excerpt: "A short note",
        content: "Original test editorial content.",
        coverImage: "/images/sola.svg",
        category: "Design",
        status: "draft",
      };
      r = await agent
        .post("/api/admin/articles")
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .send(article);
      assert.equal(r.status, 201);
      const articleId = r.body._id;
      r = await request(app).get("/api/content");
      assert.equal(r.body.articles.length, 0);
      r = await agent
        .patch("/api/admin/articles/" + articleId)
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .send({ ...article, status: "published" });
      assert.equal(r.status, 200);
      r = await request(app).get("/api/content");
      assert.equal(r.body.articles.length, 1);
      r = await request(app)
        .post("/api/contact")
        .set("Origin", origin)
        .send({
          name: "Demo Person",
          email: "demo@example.test",
          company: "Demo",
          projectType: "Website",
          budgetRange: "10k",
          message: "We would like an original website concept.",
        });
      assert.equal(r.status, 201);
      assert.equal(await ContactSubmission.countDocuments(), 1);
      r = await agent.get("/api/admin/enquiries");
      assert.equal(r.status, 200);
      const enquiryId = r.body[0]._id;
      r = await agent
        .patch("/api/admin/enquiries/" + enquiryId)
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .send({ status: "reviewed" });
      assert.equal(r.body.status, "reviewed");
      const position = {
        title: "Test role",
        slug: "test-role",
        department: "Design",
        type: "Remote",
        description: "A clearly fictional test position.",
        status: "open",
        sample: true,
      };
      r = await agent
        .post("/api/admin/positions")
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .send(position);
      assert.equal(r.status, 201);
      const positionId = r.body._id;
      r = await request(app)
        .post("/api/applications")
        .set("Origin", origin)
        .send({
          applicantName: "Demo Applicant",
          email: "applicant@example.test",
          position: positionId,
          portfolioUrl: "https://example.com",
          coverLetter:
            "A thoughtful original cover letter for this test position.",
        });
      assert.equal(r.status, 201);
      assert.equal(await CareerApplication.countDocuments(), 1);
      r = await agent
        .delete("/api/admin/positions/" + positionId)
        .set("Origin", origin)
        .set("x-csrf-token", csrf);
      assert.equal(r.status, 409);
      r = await agent
        .post("/api/admin/media")
        .set("Origin", origin)
        .set("x-csrf-token", csrf)
        .attach("image", Buffer.from("<script>bad</script>"), "fake.png");
      assert.equal(r.status, 400);
      r = await agent
        .delete("/api/admin/projects/" + projectId)
        .set("Origin", origin)
        .set("x-csrf-token", csrf);
      assert.equal(r.status, 200);
      await AdminUser.create({
        email: "editor@example.test",
        passwordHash: await bcrypt.hash(
          "editor-password-with-14-characters",
          12,
        ),
        role: "editor",
      });
      const editor = request.agent(app);
      r = await editor
        .post("/api/auth/login")
        .set("Origin", origin)
        .send({
          email: "editor@example.test",
          password: "editor-password-with-14-characters",
        });
      const editorCsrf = r.body.csrf;
      r = await editor
        .post("/api/admin/projects")
        .set("Origin", origin)
        .set("x-csrf-token", editorCsrf)
        .send(project);
      assert.equal(r.status, 403);
      r = await agent
        .post("/api/auth/logout")
        .set("Origin", origin)
        .set("x-csrf-token", csrf);
      assert.equal(r.status, 200);
      r = await agent.get("/api/auth/me");
      assert.equal(r.status, 401);
    } finally {
      await mongoose.disconnect();
      await database.stop();
    }
  },
);
