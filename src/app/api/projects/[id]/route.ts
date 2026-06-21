import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import Project from "@/src/lib/models/project";
import { verifyToken } from "@/src/lib/middleware/auth";
import type { AuthSuccess } from "@/src/lib/middleware/auth";

function isAuthSuccess(
  auth: ReturnType<typeof verifyToken>
): auth is AuthSuccess {
  return "userId" in auth;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = verifyToken(request);
  const isAuthenticated = isAuthSuccess(authResult);
  const userId = isAuthenticated ? (authResult as AuthSuccess).userId : null;

  try {
    await dbConnect();

    const project = await Project.findById(params.id)
      .populate("owner", "username email avatar")
      .populate("collaborators.userId", "username email avatar")
      .lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const hasOwner = !!project.owner;
    const isOwner = hasOwner && userId && String(project.owner) === userId;
    const isCollaborator =
      userId &&
      project.collaborators?.some((c) => String(c.userId) === userId);

    if (hasOwner && !isOwner && !isCollaborator && project.visibility !== "public") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (err) {
    console.error("Error fetching project:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = verifyToken(request);
  const isAuthenticated = isAuthSuccess(authResult);
  const userId = isAuthenticated ? (authResult as AuthSuccess).userId : null;

  try {
    await dbConnect();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const hasOwner = !!project.owner;
    const isOwner = hasOwner && userId && project.owner.toString() === userId;
    const isEditor = userId &&
      project.collaborators?.some(
        (c) => c.userId.toString() === userId && c.role === "editor"
      );

    if (hasOwner && !isOwner && !isEditor) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      "title",
      "description",
      "programmingLanguage",
      "visibility",
      "code",
      "archived",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "title" && !body.title?.trim()) {
          return NextResponse.json(
            { success: false, error: "Title cannot be empty" },
            { status: 400 }
          );
        }
        (project as unknown as Record<string, unknown>)[field] = body[field];
      }
    }

    await project.save();

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (err) {
    console.error("Error updating project:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = verifyToken(request);
  const isAuthenticated = isAuthSuccess(authResult);
  const userId = isAuthenticated ? (authResult as AuthSuccess).userId : null;

  try {
    await dbConnect();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const hasOwner = !!project.owner;
    if (hasOwner && (!userId || project.owner.toString() !== userId)) {
      return NextResponse.json(
        { success: false, error: "Only the owner can delete a project" },
        { status: 403 }
      );
    }

    await Project.findByIdAndDelete(params.id);

    return NextResponse.json(
      { success: true, message: "Project deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting project:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
