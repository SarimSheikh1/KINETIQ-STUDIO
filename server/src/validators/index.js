import { z } from "zod";
const str = (min = 1, max = 200) => z.string().trim().min(min).max(max);
const url = z
  .string()
  .url()
  .max(2000)
  .refine((v) => /^https?:\/\//.test(v), "Use an HTTP or HTTPS URL");
const media = z
  .string()
  .max(2000)
  .refine(
    (v) =>
      v.startsWith("/images/") ||
      v.startsWith("/uploads/") ||
      /^https:\/\//.test(v),
    "Use a safe image URL",
  );
export const contact = z.object({
  name: str(2),
  email: z.string().email().max(254),
  company: z.string().max(200).default(""),
  projectType: str(),
  budgetRange: str(),
  message: str(20, 5000),
  website: z.string().max(0).optional(),
});
export const application = z.object({
  applicantName: str(2),
  email: z.string().email().max(254),
  position: z.string().regex(/^[a-f\d]{24}$/i),
  portfolioUrl: url,
  coverLetter: str(30, 5000),
  website: z.string().max(0).optional(),
});
export const login = z.object({
  email: z.string().email(),
  password: str(1, 200),
});
const slug = str().regex(/^[a-z0-9-]+$/);
export const schemas = {
  projects: z.object({
    title: str(),
    slug,
    category: str(),
    summary: str(),
    description: str(1, 20000),
    color: z.string().regex(/^#[a-f\d]{6}$/i),
    media: z.array(media).max(20),
    featured: z.boolean(),
    displayOrder: z.number().int().min(0),
    published: z.boolean(),
  }),
  articles: z.object({
    title: str(),
    slug,
    excerpt: str(1, 1000),
    content: str(1, 50000),
    coverImage: media,
    category: str(),
    status: z.enum(["draft", "published"]),
    publishedAt: z.string().optional(),
  }),
  team: z.object({
    name: str(),
    role: str(),
    biography: str(1, 5000),
    image: media,
    displayOrder: z.number().int().min(0),
  }),
  positions: z.object({
    title: str(),
    slug,
    department: str(),
    type: str(),
    description: str(1, 10000),
    status: z.enum(["open", "closed"]),
    sample: z.boolean(),
  }),
  enquiries: z.object({ status: z.enum(["new", "reviewed", "archived"]) }),
  applications: z.object({
    status: z.enum(["new", "reviewed", "shortlisted", "rejected"]),
  }),
};
