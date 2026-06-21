import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./user";

export type ProjectVisibility = "public" | "private";
export type CollaboratorRole = "owner" | "editor" | "viewer";

export interface ICollaborator {
  userId: Types.ObjectId;
  role: CollaboratorRole;
  joinedAt: Date;
}

export interface IProjectDocument extends Document {
  title: string;
  description?: string;
  programmingLanguage: string;
  visibility: ProjectVisibility;
  owner?: Types.ObjectId | null;
  collaborators: ICollaborator[];
  code?: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const collaboratorSchema = new Schema<ICollaborator>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "editor", "viewer"],
      default: "editor",
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const projectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    programmingLanguage: { type: String, default: "javascript" },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
      index: true,
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
    code: { type: String, default: "// your code..." },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, archived: 1 });
projectSchema.index(
  { title: "text", description: "text" },
  { default_language: "none" }
);

const Project: Model<IProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", projectSchema, "projects");

export default Project;
