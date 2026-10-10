import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { contact, application, schemas } from "../src/validators/index.js";
const app = createApp({ test: true });
test("admin content requires authentication", async () => {
  const r = await request(app).get("/api/admin/projects");
  assert.equal(r.status, 401);
});
test("cross-origin mutations are rejected", async () => {
  const r = await request(app)
    .post("/api/contact")
    .set("Origin", "https://evil.example")
    .send({});
  assert.equal(r.status, 403);
});
test("invalid contact fails before storage", async () => {
  const r = await request(app)
    .post("/api/contact")
    .set("Origin", "http://localhost:5173")
    .send({ name: "A", email: "bad" });
  assert.equal(r.status, 400);
});
test("honeypot rejects spam", () =>
  assert.equal(
    contact.safeParse({
      name: "Person",
      email: "a@b.com",
      projectType: "Brand",
      budgetRange: "10k",
      message: "A sufficiently long project message",
      website: "spam",
    }).success,
    false,
  ));
test("application rejects unsafe portfolio protocols", () =>
  assert.equal(
    application.safeParse({
      applicantName: "Person",
      email: "a@b.com",
      position: "a".repeat(24),
      portfolioUrl: "javascript:alert(1)",
      coverLetter: "A sufficiently long cover letter for this role.",
    }).success,
    false,
  ));
test("project media rejects script urls and extra fields are stripped", () => {
  const base = {
    title: "Test",
    slug: "test",
    category: "Branding",
    summary: "Summary",
    description: "Description",
    color: "#FF654F",
    media: ["/images/test.svg"],
    featured: true,
    displayOrder: 0,
    published: true,
    password: "secret",
  };
  assert.equal(schemas.projects.parse(base).password, undefined);
  assert.equal(
    schemas.projects.safeParse({ ...base, media: ["javascript:alert(1)"] })
      .success,
    false,
  );
});
