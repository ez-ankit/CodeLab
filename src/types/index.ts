export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectVisibility = "public" | "private";
export type CollaboratorRole = "owner" | "editor" | "viewer";

export interface ICollaborator {
  userId: string;
  role: CollaboratorRole;
  joinedAt: Date;
}

export interface IProject {
  _id?: string;
  title: string;
  description?: string;
  programmingLanguage: string;
  visibility: ProjectVisibility;
  owner: string;
  collaborators: ICollaborator[];
  code?: string;
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectFormData = Pick<
  IProject,
  "title" | "description" | "programmingLanguage" | "visibility"
>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
