import mongoose from "mongoose";
const { Schema } = mongoose;
const text = { type: String, required: true, trim: true };
const schema = (fields) => new Schema(fields, { timestamps: true });
const slug = { ...text, unique: true, index: true };
export const Project = mongoose.model(
  "Project",
  schema({
    title: text,
    slug,
    category: text,
    summary: text,
    description: text,
    color: String,
    media: [String],
    featured: Boolean,
    displayOrder: Number,
    published: Boolean,
  }),
);
export const Article = mongoose.model(
  "Article",
  schema({
    title: text,
    slug,
    excerpt: text,
    content: text,
    coverImage: String,
    category: text,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: Date,
  }),
);
export const TeamMember = mongoose.model(
  "TeamMember",
  schema({
    name: text,
    role: text,
    biography: text,
    image: String,
    displayOrder: Number,
  }),
);
export const ContactSubmission = mongoose.model(
  "ContactSubmission",
  schema({
    name: text,
    email: text,
    company: String,
    projectType: text,
    budgetRange: text,
    message: text,
    status: {
      type: String,
      enum: ["new", "reviewed", "archived"],
      default: "new",
    },
  }),
);
export const CareerPosition = mongoose.model(
  "CareerPosition",
  schema({
    title: text,
    slug,
    department: text,
    type: text,
    description: text,
    status: { type: String, enum: ["open", "closed"], default: "open" },
    sample: { type: Boolean, default: false },
  }),
);
export const CareerApplication = mongoose.model(
  "CareerApplication",
  schema({
    applicantName: text,
    email: text,
    position: {
      type: Schema.Types.ObjectId,
      ref: "CareerPosition",
      required: true,
    },
    portfolioUrl: text,
    coverLetter: text,
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
  }),
);
export const AdminUser = mongoose.model(
  "AdminUser",
  schema({
    email: { ...text, unique: true, lowercase: true },
    passwordHash: text,
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  }),
);
export const modules = {
  projects: Project,
  articles: Article,
  team: TeamMember,
  positions: CareerPosition,
  enquiries: ContactSubmission,
  applications: CareerApplication,
};
